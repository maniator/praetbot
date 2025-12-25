# Web Interface Guide

Praetbot includes a Next.js web interface that runs alongside the Discord bot, providing a modern dashboard and API endpoints for viewing bot data and statistics.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Available Routes](#available-routes)
- [API Endpoints](#api-endpoints)
- [Adding New Routes](#adding-new-routes)
- [Deploying the Web Interface](#deploying-the-web-interface)
- [Security Considerations](#security-considerations)

## Overview

The web interface provides:

- **Dashboard** - View bot statistics and cookie leaderboard
- **JSON API** - Access bot data programmatically via Next.js API routes
- **Modern React/Next.js** - TypeScript, server components, and dynamic routing
- **Responsive Design** - Works on desktop and mobile devices
- **Separate from Bot** - Can be deployed independently

## Architecture

The web interface is built with:
- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Location**: `/web` directory in the monorepo
- **API Routes**: `/web/app/api/*` for backend endpoints
- **Pages**: `/web/app/page.tsx` and other page components

The Discord bot continues to run in the background as a separate process (`app.ts` at root level).

## Getting Started

### Starting the Server

```bash
# Start both Discord bot and web interface together
npm run dev

# Start web interface only (without Discord bot)
npm run dev:web

# Start bot only
npm run dev:bot
```

The server runs on port 3000 by default for the web interface.

### Accessing Locally

Open your browser to:

```
http://localhost:3000
```

## Available Pages

### Home Page

**`GET /`**

Renders the home page with Praetbot welcome information.

**Response:** HTML page

**Example:**

```bash
curl http://localhost:3000
```

---

### Users Page

**`GET /users`**

Displays a table of all users and their cookie counts, sorted by most cookies first.

**Response:** HTML page with styled table

**Example:**

```bash
curl http://localhost:3000/users
```

## Adding New Pages

To add a new page, create a new file in `/web/app/` using Next.js conventions:

```typescript
// /web/app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Praetbot</h1>
      <p>Your content here</p>
    </main>
  );
}
```

This will be automatically available at `/about`.

## Customizing the Interface

### Project Structure

```
praetbot/
├── app.ts               # Discord bot entry point
├── bot/                 # Bot implementation and commands
├── bin/                 # Legacy bin directory (uses lib)
├── lib/                 # Shared library (database, utilities)
├── routes/              # Legacy Express routes (for reference)
├── web/                 # Next.js web application
│   ├── app/
│   │   ├── page.tsx     # Home page
│   │   ├── users/
│   │   │   └── page.tsx # Users/cookies page
│   │   ├── layout.tsx   # Root layout
│   │   └── globals.css  # Global styles
│   ├── lib/             # Re-exports shared lib
│   ├── public/          # Static assets
│   └── package.json
└── package.json         # Root dependencies
```
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

## Adding New Pages

### Example: Add a Stats Page

Create `web/app/stats/page.tsx`:

```typescript
export default async function StatsPage() {
  // You can fetch data here
  // const stats = await getStats();

  return (
    <main>
      <h1>Bot Statistics</h1>
      <div>
        <h2>Server Stats</h2>
        <p>Guilds: --</p>
        <p>Users: --</p>
        <p>Commands Run: --</p>
      </div>
    </main>
  );
}
```

Now the page is automatically available at `/stats`.

### Example: Add a Leaderboard Page

Create `web/app/leaderboard/page.tsx`:

```typescript
import { getCookies } from '../../bin/cookies.js';

export default async function LeaderboardPage() {
  let cookies: Record<string, number> = {};
  let error: string | null = null;

  try {
    cookies = await getCookies();
  } catch {
    error = 'Failed to fetch leaderboard';
  }

  const sorted = Object.entries(cookies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 100); // Top 100

  return (
    <main>
      <h1>Cookie Leaderboard</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <ol>
          {sorted.map(([userId, count], index) => (
            <li key={userId}>
              {index + 1}. <code>{userId}</code> - {count} cookies
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
```

This uses server-side data fetching to display the leaderboard.

### Creating API Routes (Optional)

If you need JSON endpoints, create files in `/web/app/api/`:

```typescript
// /web/app/api/cookies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCookies } from '../../../bin/cookies.js';

export async function GET(_req: NextRequest) {
  try {
    const cookies = await getCookies();
    return NextResponse.json(cookies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cookies' },
      { status: 500 }
    );
  }
}
```

Now available at `/api/cookies`.

---

## Old: Express Routing

The original Express routing examples are kept below for reference. The codebase has been migrated to Next.js pages.

### Example: Add Leaderboard Route (Express - Legacy)

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

### Example: Add Commands API (Express - Legacy)

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
# Option 1: Use MongoDB connection string (recommended)
MONGODB_URI=your_mongodb_connection_string

# Option 2: Use individual credentials (not needed if MONGODB_URI is provided)
# MONGO_USER=your_username
# MONGO_PASSWORD=your_password
# MONGO_SERVER=your_host:port/database
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
# Option 1: Use MongoDB connection string (recommended)
MONGODB_URI=mongodb://localhost:27017/praetbot

# Option 2: Use individual credentials (not needed if MONGODB_URI is provided)
# MONGO_SERVER=localhost:27017/praetbot
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
