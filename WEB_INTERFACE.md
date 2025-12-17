# Web Interface Guide

Praetbot includes an Express.js web interface that runs alongside the Discord bot, providing HTTP endpoints for viewing bot data and statistics.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Available Endpoints](#available-endpoints)
- [Customizing the Interface](#customizing-the-interface)
- [Adding New Routes](#adding-new-routes)
- [Deploying the Web Interface](#deploying-the-web-interface)
- [Security Considerations](#security-considerations)
- [API Documentation](#api-documentation)

## Overview

The web interface provides:

- **View cookie leaderboard** - See which users have the most cookies
- **JSON API** - Access bot data programmatically
- **Extensible architecture** - Easy to add new routes and features
- **Modern Express setup** - TypeScript, ESM modules, async/await

## Getting Started

### Starting the Server

```bash
# Start both Discord bot and web interface
npm start

# Start web interface only (without Discord bot)
npm run dev:web

# Start with auto-reload during development
npm run dev:web:watch
```

The server runs on port 3000 by default (configurable via `PORT` environment variable).

### Accessing Locally

Open your browser to:

```
http://localhost:3000
```

## Available Endpoints

### Home Page

**`GET /`**

Renders the home page with bot information.

**Response:** HTML page

**Example:**

```bash
curl http://localhost:3000
```

---

### Users Endpoint

**`GET /users`**

Returns all users and their cookie counts as JSON.

**Response:** JSON array of user objects

**Example Request:**

```bash
curl http://localhost:3000/users
```

**Example Response:**

```json
[
  {
    "id": "123456789012345678",
    "name": "Alice",
    "cookies": 42
  },
  {
    "id": "987654321098765432",
    "name": "Bob",
    "cookies": 15
  },
  {
    "id": "555555555555555555",
    "name": "Charlie",
    "cookies": 8
  }
]
```

**Using in JavaScript:**

```javascript
fetch('http://localhost:3000/users')
  .then((res) => res.json())
  .then((users) => {
    console.log('Top user:', users[0]);
  });
```

**Using in Python:**

```python
import requests

response = requests.get('http://localhost:3000/users')
users = response.json()

# Sort by cookies
sorted_users = sorted(users, key=lambda x: x['cookies'], reverse=True)
print(f"Top user: {sorted_users[0]['name']} with {sorted_users[0]['cookies']} cookies")
```

## Customizing the Interface

### Project Structure

```
praetbot/
├── eApp.ts              # Main Express application
├── routes/              # Route handlers
│   ├── index.ts         # Home page route
│   └── users.ts         # Users API route
├── views/               # Handlebars templates
│   ├── index.hbs        # Home page template
│   ├── layout.hbs       # Base layout
│   └── error.hbs        # Error page
├── public/              # Static assets
│   ├── stylesheets/
│   └── images/
└── bin/
    └── www.ts           # HTTP server setup
```

### Modifying Templates

Templates use Handlebars (`.hbs` files).

**Example: Edit Home Page (`views/index.hbs`)**

```handlebars
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>

<div class='features'>
  <h2>Features</h2>
  <ul>
    <li>Cookie tracking system</li>
    <li>Custom commands</li>
    <li>Weather information</li>
  </ul>
</div>

<a href='/users'>View Cookie Leaderboard</a>
```

**Create a leaderboard page (`views/leaderboard.hbs`)**

```handlebars
<h1>Cookie Leaderboard</h1>

<table>
  <thead>
    <tr>
      <th>Rank</th>
      <th>User</th>
      <th>Cookies</th>
    </tr>
  </thead>
  <tbody>
    {{#each users}}
      <tr>
        <td>{{@index}}</td>
        <td>{{this.name}}</td>
        <td>{{this.cookies}} 🍪</td>
      </tr>
    {{/each}}
  </tbody>
</table>
```

### Adding CSS Styles

Create `public/stylesheets/style.css`:

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  color: #5865f2; /* Discord blurple */
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #5865f2;
  color: white;
}

tr:hover {
  background: #f9f9f9;
}
```

Update `eApp.ts` to serve static files (already included):

```typescript
app.use(express.static(path.join(__dirname, 'public')));
```

## Adding New Routes

### Example: Add Leaderboard Route

Create `routes/leaderboard.ts`:

```typescript
import express, { Request, Response } from 'express';
import { getCookies } from '../bin/cookies.js';

const router = express.Router();

/* GET leaderboard page */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await getCookies();

    // Sort by cookies (descending)
    const sorted = users.sort((a, b) => (b.cookies || 0) - (a.cookies || 0));

    res.render('leaderboard', {
      title: 'Cookie Leaderboard',
      users: sorted,
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Failed to load leaderboard',
      error,
    });
  }
});

export default router;
```

Register the route in `eApp.ts`:

```typescript
import leaderboardRouter from './routes/leaderboard.js';

// ... other code ...

app.use('/leaderboard', leaderboardRouter);
```

### Example: Add Commands API

Create `routes/commands.ts`:

```typescript
import express, { Request, Response } from 'express';
import { connect } from '../bin/dbConnect.js';
import { Db } from 'mongodb';

const router = express.Router();

/* GET all custom commands */
router.get('/', async (_req: Request, res: Response) => {
  connect(async (db: Db) => {
    try {
      const commands = await db.collection('commands').find({}).toArray();
      res.json(commands);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch commands' });
    } finally {
      await db.close();
    }
  });
});

/* GET specific command */
router.get('/:name', async (req: Request, res: Response) => {
  const { name } = req.params;

  connect(async (db: Db) => {
    try {
      const command = await db.collection('commands').findOne({ _id: name });

      if (!command) {
        res.status(404).json({ error: 'Command not found' });
        return;
      }

      res.json(command);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch command' });
    } finally {
      await db.close();
    }
  });
});

export default router;
```

Add to `eApp.ts`:

```typescript
import commandsRouter from './routes/commands.js';

app.use('/api/commands', commandsRouter);
```

Access at:

- `http://localhost:3000/api/commands` - All commands
- `http://localhost:3000/api/commands/test` - Specific command

### Example: Add Health Check Endpoint

Create `routes/health.ts`:

```typescript
import express, { Request, Response } from 'express';
import { connect } from '../bin/dbConnect.js';
import { Db } from 'mongodb';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'unknown',
  };

  try {
    // Check database connection
    await new Promise<void>((resolve, reject) => {
      connect(async (db: Db) => {
        try {
          await db.admin().ping();
          health.database = 'connected';
          resolve();
        } catch (error) {
          health.database = 'error';
          reject(error);
        } finally {
          await db.close();
        }
      });
    });
  } catch (error) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
```

Usage:

```bash
curl http://localhost:3000/health

# Response:
{
  "status": "ok",
  "timestamp": "2025-12-17T19:00:00.000Z",
  "uptime": 123.456,
  "database": "connected"
}
```

## Deploying the Web Interface

### Environment Variables

```env
# Web server port
PORT=3000

# Database connection (same as bot)
MONGO_USER=your_username
MONGO_PASSWORD=your_password
MONGO_SERVER=your_host:port/database
```

### Running in Production

```bash
# Build TypeScript
npm run build

# Start server
NODE_ENV=production npm start
```

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start web server
pm2 start npm --name "praetbot-web" -- run dev:web

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

### Docker

The provided `Dockerfile` includes the web interface. Port 3000 is exposed by default.

```bash
docker run -p 3000:3000 -e PORT=3000 praetbot
```

### Platform-Specific Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:

- AWS (Elastic Beanstalk, EC2)
- Azure (App Service)
- Google Cloud (Cloud Run)
- Heroku
- Railway
- Render

Most platforms will automatically detect and run the web interface.

## Security Considerations

### Authentication

The current implementation has no authentication. For production use, consider adding:

**Basic Auth Example:**

```typescript
import basicAuth from 'express-basic-auth';

app.use(
  basicAuth({
    users: { admin: process.env.ADMIN_PASSWORD || 'changeme' },
    challenge: true,
  })
);
```

**JWT Authentication:**

```typescript
import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.use('/api', authenticateJWT);
```

### Rate Limiting

Prevent abuse with rate limiting:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### CORS Configuration

If accessing from a different domain:

```bash
npm install cors
```

```typescript
import cors from 'cors';

app.use(
  cors({
    origin: 'https://yourdomain.com',
    optionsSuccessStatus: 200,
  })
);
```

### HTTPS

Always use HTTPS in production. Most hosting platforms provide this automatically.

For self-hosted:

```typescript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

https.createServer(options, app).listen(443);
```

## API Documentation

### Building an API

Example OpenAPI/Swagger documentation:

```bash
npm install swagger-ui-express swagger-jsdoc
```

Create `swagger.ts`:

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Praetbot API',
      version: '1.0.0',
      description: 'Discord bot API endpoints',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
```

In `eApp.ts`:

```typescript
import { specs, swaggerUi } from './swagger.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

Access documentation at `http://localhost:3000/api-docs`

## Frontend Integration Examples

### React Example

```jsx
import { useEffect, useState } from 'react';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.sort((a, b) => b.cookies - a.cookies));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Cookie Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Cookies</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.cookies} 🍪</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Vue.js Example

```vue
<template>
  <div>
    <h1>Cookie Leaderboard</h1>
    <table v-if="!loading">
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Cookies</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in sortedUsers" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.cookies }} 🍪</td>
        </tr>
      </tbody>
    </table>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
    };
  },
  computed: {
    sortedUsers() {
      return [...this.users].sort((a, b) => b.cookies - a.cookies);
    },
  },
  mounted() {
    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then((data) => {
        this.users = data;
        this.loading = false;
      });
  },
};
</script>
```

## Testing the Web Interface

Tests are located in:

- `eApp.test.ts` - Main application tests
- `routes/index.test.ts` - Home route tests
- `routes/users.test.ts` - Users route tests

Run tests:

```bash
npm test
```

Example test:

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './eApp';

describe('GET /users', () => {
  it('should return users array', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev:web
```

### Database Connection Issues

Check your MongoDB connection string in `.env`:

```env
# Format: mongodb://username:password@host:port/database
MONGO_SERVER=localhost:27017/praetbot
```

### Template Not Found

Ensure views are in the correct directory:

```
views/
├── index.hbs
├── error.hbs
└── layout.hbs
```

### Static Files Not Loading

Verify `public/` directory structure:

```
public/
├── stylesheets/
│   └── style.css
└── images/
    └── logo.png
```

## Further Reading

- [Express.js Documentation](https://expressjs.com/)
- [Handlebars Documentation](https://handlebarsjs.com/)
- [TypeScript Express Tutorial](https://developer.okta.com/blog/2018/11/15/node-express-typescript)
- [RESTful API Design](https://restfulapi.net/)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new web features.

## License

This guide is part of Praetbot, licensed under the MIT License.
