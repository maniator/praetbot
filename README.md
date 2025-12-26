# Praetbot - Discord Bot + Web Interface

A Discord bot with custom commands, cookie tracking, and various utilities, plus a Next.js web interface for managing the bot.

## Features

- 🍪 **Cookie System**: Give or take cookies from users with `@user ++` or `@user --`
- 🎲 **Random User Picker**: Use `!!roll` to randomly select a user from the channel
- 🌤️ **Weather**: Get weather information with `!!weather city` or `!!weather (lat, lon)`
- 🎨 **XKCD Comics**: Fetch XKCD comics by ID with `!!xkcd <id>`
- 📝 **Custom Commands**: Create, list, and remove custom commands dynamically
- 💬 **Help System**: Get help for any command with `!!help <command>`
- 🌐 **Web Dashboard**: Next.js-based web interface for monitoring and managing the bot

## Architecture

- **Bot**: Discord bot running in the background (`app.ts`)
- **Web Interface**: Next.js app in the `web/` directory serving the dashboard and API routes

## Requirements

- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB database
- Discord Bot Token

## Installation

```bash
# Install dependencies (npm workspaces handles all packages)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

## Discord Bot Setup

Before running the bot, you need to create a Discord application and get your bot token:

### 1. Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Enter a name for your application (e.g., "Praetbot")
4. Click **Create**

### 2. Create a Bot User

1. In your application, navigate to the **Bot** section in the left sidebar
2. Click **Add Bot**
3. Click **Yes, do it!** to confirm
4. Under the bot's username, click **Reset Token**
5. Click **Yes, do it!** and copy the token
6. **Save this token securely** - this is your `BOT_API_KEY`

### 3. Configure Bot Permissions

1. In the **Bot** section, scroll down to **Privileged Gateway Intents**
2. Enable the following intents:
   - ✅ **SERVER MEMBERS INTENT** (to access guild member information)
   - ✅ **MESSAGE CONTENT INTENT** (to read message content)
3. Click **Save Changes**

### 4. Invite Bot to Your Server

1. Navigate to the **OAuth2** → **URL Generator** section
2. Under **Scopes**, select:
   - ✅ `bot`
3. Under **Bot Permissions**, select:
   - ✅ **Send Messages**
   - ✅ **Read Messages/View Channels**
   - ✅ **Read Message History**
   - ✅ **Embed Links**
   - ✅ **Attach Files**
   - ✅ **Add Reactions**
   - ✅ **Use External Emojis**
   - Or simply select **Administrator** for full permissions (easier for development)
4. Copy the generated URL at the bottom
5. Paste the URL in your browser and select the server to add the bot to
6. Click **Authorize**

### 5. Add Token to Environment Variables

Add the bot token you copied in step 2 to your `.env` file:

```env
BOT_API_KEY=your_token_here
```

## Environment Variables

```env
BOT_API_KEY=your_discord_bot_token
# Option 1: Use MongoDB connection string (recommended)
MONGODB_URI=your_mongodb_connection_string

# Option 2: Use individual credentials (not needed if MONGODB_URI is provided)
# MONGO_USER=your_mongodb_user
# MONGO_PASSWORD=your_mongodb_password
# MONGO_SERVER=your_mongodb_server:port/database
WEATHER_KEY=your_openweathermap_api_key
```

## Development

This project uses **Turborepo** to manage monorepo tasks across all workspaces:

````bash
# Run all dev servers (bot + web)
npm run dev

# Run specific workspace dev server
npm run dev --filter=@praetbot/bot
npm run dev --filter=@praetbot/web

# Build all workspaces
npm run build

# Build specific workspace
npm run build --filter=@praetbot/bot
npm run build --filter=@praetbot/web

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint all workspaces
npm run lint

# Fix linting issues
npm run lint:fix

# Format all code
npm run format
Turborepo orchestrates builds across all workspaces with proper dependency order:

```bash
# Build all workspaces for production
npm run build

# Build specific workspace
npm run build:bot    # Bot Vite build + shared-lib TypeScript compilation
npm run build:web    # Web Next.js build
````

**Build Output:**

- `apps/bot/dist/` - Bundled bot application
- `apps/web/.next/` - Next.js build output
- `packages/shared-lib/dist/` - Compiled shared library (TypeScript → JavaScript)int and test tasks run in parallel across workspaces

## Building

```bash
# Build both bot and web interface for production
npm run build

# Build just the bot
npm run build:bot

# Build just the web interface
npm run build:web
```

## Project Structure

Praetbot uses **Turborepo** for monorepo management with three main workspaces:

```
praetbot/
├── apps/
│   ├── bot/                       # Discord bot application
│   │   ├── app.ts               # Entry point
│   │   ├── index.ts             # Bot class
│   │   ├── command.ts           # Command listener
│   │   ├── commands.ts          # Built-in commands registry
│   │   ├── commands/            # Individual command modules
│   │   ├── routes/              # Express API routes
│   │   ├── tests/               # Bot-specific tests
│   │   ├── vite.config.ts       # Vite build config
│   │   ├── vitest.config.ts     # Vitest config
│   │   ├── tsconfig.json        # TypeScript config
│   │   └── package.json         # Bot dependencies
│   │
│   └── web/                       # Next.js web interface
│       ├── app/
│       │   ├── page.tsx         # Home page
│       │   ├── users/
│       │   │   └── page.tsx     # Users/cookies page
│       │   ├── layout.tsx       # Root layout
│       │   └── globals.css      # Global styles
│       ├── lib/                 # Re-exports shared utilities
│       ├── public/              # Static assets
│       ├── next.config.ts       # Next.js config
│       ├── tsconfig.json        # TypeScript config
│       └── package.json         # Web app dependencies
│
├── packages/
│   └── shared-lib/                # Shared library package
│       ├── cookies.ts           # Cookie operations
│       ├── dbConnect.ts         # MongoDB connection
│       ├── cookies.test.ts      # Cookie tests
│       ├── dbConnect.test.ts    # Connection tests
│       ├── tsconfig.json        # TypeScript config
│       ├── vitest.config.ts     # Vitest config
│       └── package.json         # Library dependencies
│
├── docs/                          # Documentation
├── .github/                       # GitHub configuration
├── package.json                   # Root monorepo config
├── turbo.json                    # Turborepo configuration
├── vercel.json                   # Vercel deployment config
└── tsconfig.json                 # Root TypeScript config
```

### Workspace Structure

- **@praetbot/bot** - Discord bot app with Express routes, commands, and tests
- **@praetbot/web** - Next.js 15 web interface for monitoring
- **@praetbot/shared-lib** - Shared MongoDB utilities (cookies, database connection)

## Web Interface

Praetbot ships with a Next.js web interface (App Router) that runs alongside the Discord bot.

![Web Interface Preview](docs/screenshots/home-page.png)
_Web interface powered by Next.js_

### Starting the Web Server

```bash
# Start both bot and web interface (concurrently)
npm run dev

# Start web interface only
npm run dev:web
```

The web interface is available at `http://localhost:3000` during development.

### Available Pages

- **`GET /`** - Home page with Praetbot welcome information
- **`GET /users`** - Users and cookie counts rendered as an HTML table

### Accessing the Web Interface

**Local Development:**

```
http://localhost:3000
```

**Production:**
Replace `localhost:3000` with your deployment URL (e.g., `https://your-app.vercel.app`)

### Environment Variables

- **`MONGODB_URI`**: Connection string for MongoDB Atlas or server
- **`MONGODB_DB`**: Optional. Database name to use (defaults to `praetbot`)

### Example: Viewing Cookie Leaderboard

Open `http://localhost:3000/users` to see a sorted table of users and cookie counts.

### Customizing the Web Interface

The web interface is built with Next.js and React:

- **Pages:** `web/app/` directory with Next.js App Router
- **Library code:** `lib/` directory (shared with bot)
- **Static files:** `web/public/` directory
- **Configuration:** `web/next.config.js`, `web/tsconfig.json`

See [WEB_INTERFACE.md](WEB_INTERFACE.md) for detailed customization guide.

### 🌐 Modern Next.js Architecture

The web interface uses Next.js with App Router for a modern, performant experience with server-side rendering and static generation capabilities.

**Contributing to the Web Interface:**

- Modern, beautiful UI
- Visual cookie leaderboard
- Responsive design
- Charts and statistics
- Better overall UX

**Join the discussion:**

- Share your thoughts in [GitHub Discussions](https://github.com/maniator/praetbot/discussions)
- See [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) for detailed framework options and design ideas
- Submit a prototype with your preferred stack!

All approaches welcome - we can maintain multiple frontend implementations!

## Deployment

See the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md) guide for detailed instructions on deploying to:

- AWS (EC2, Elastic Beanstalk, Lambda)
- Azure (App Service, Container Instances)
- Google Cloud Platform (Cloud Run, Compute Engine)
- Vercel
- Heroku
- Digital Ocean
- Railway
- Render
- Docker (with docker-compose)

Quick Docker deployment:

```bash
docker-compose up -d
```

## Available Commands

### User Commands

- `!!help <command>` - Get help for a specific command
- `!!listCommands` - List all available commands
- `!!weather <city>` or `!!weather (lat, lon)` - Get weather information
- `!!xkcd <id>` - Get an XKCD comic by ID
- `!!roll <question>` - Randomly select a user to answer a question

### Admin Commands

- `!!addCommand <name> <code>` - Add a custom command
- `!!removeCommand <name>` - Remove a custom command

### Cookie System

- `@user ++` - Give a cookie to a user
- `@user --` - Take a cookie from a user

## Tech Stack

- **Runtime**: Node.js 20.19.6
- **Language**: TypeScript 5.7.2
- **Discord API**: Discord.js v14
- **Database**: MongoDB 6.11.0
- **Testing**: Vitest 2.1.8
- **Building**: Vite 6.0.3
- **Linting**: ESLint 9.17.0
- **Formatting**: Prettier 3.4.2
- **Web Framework**: Next.js 15

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Linting**: ESLint and Prettier checks
- **Testing**: Automated test suite with coverage reporting
- **Type Checking**: TypeScript compilation verification
- **Building**: Build artifacts generation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Community

Join our Discord community (coming soon) to:

- Get help with setup and deployment
- Share your custom commands
- Report bugs and request features
- Connect with other Praetbot users

## Acknowledgments

- Built with [Discord.js](https://discord.js.org/)
- Powered by [Node.js](https://nodejs.org/)
- Weather data from [OpenWeatherMap](https://openweathermap.org/)
