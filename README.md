# Praetbot - Discord Bot

A Discord bot with custom commands, cookie tracking, and various utilities.

## Features

- 🍪 **Cookie System**: Give or take cookies from users with `@user ++` or `@user --`
- 🎲 **Random User Picker**: Use `!!roll` to randomly select a user from the channel
- 🌤️ **Weather**: Get weather information with `!!weather city` or `!!weather (lat, lon)`
- 🎨 **XKCD Comics**: Fetch XKCD comics by ID with `!!xkcd <id>`
- 📝 **Custom Commands**: Create, list, and remove custom commands dynamically
- 💬 **Help System**: Get help for any command with `!!help <command>`

## Requirements

- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB database
- Discord Bot Token

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

## Environment Variables

```env
BOT_API_KEY=your_discord_bot_token
MONGO_USER=your_mongodb_user
MONGO_PASSWORD=your_mongodb_password
MONGO_SERVER=your_mongodb_server:port/database
WEATHER_KEY=your_openweathermap_api_key
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Building

```bash
# Build for production
npm run build

# The built files will be in the dist/ directory
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
- **Web Framework**: Express 4.21.2

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

This project is private and proprietary.
