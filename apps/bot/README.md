# Praetbot Discord Bot

The Discord bot application for Praetbot, built with TypeScript and Discord.js v14.

## Overview

This workspace contains the Discord bot that powers Praetbot, featuring custom commands, cookie tracking, sandboxed code execution, and various utilities.

## Features

- **Custom Commands**: Dynamic command creation using sandboxed execution (vm2)
- **Cookie System**: Track and manage cookies for Discord users
- **Built-in Commands**: Roll, weather, 8ball, ASCII art, dice, and more
- **Message Handling**: Sophisticated command parsing and response system
- **MongoDB Integration**: Persistent storage via shared-lib

## Technology Stack

- **Runtime**: Node.js >= 20.0.0
- **Language**: TypeScript 5.7.2
- **Discord API**: Discord.js v14.16.3
- **Database**: MongoDB 6.11.0 (via @praetbot/shared-lib)
- **Testing**: Vitest 2.1.8
- **Build Tool**: Vite 6.0.3
- **Development**: tsx (TypeScript execution)

## Project Structure

```
apps/bot/
├── app.ts                  # Bot entry point
├── index.ts                # Main bot class
├── command.ts              # Command listener
├── command-interface.ts    # Type definitions
├── commands.ts             # Built-in commands registry
├── message.ts              # Message handling utilities
├── sandbox.ts              # Sandboxed code execution
├── types.ts                # Shared type definitions
├── commands/               # Individual command modules
│   ├── roll.ts
│   ├── weather.ts
│   ├── 8ball.ts
│   ├── ascii.ts
│   └── *.test.ts          # Tests alongside implementation
└── tests/                  # Additional test files
```

## Development

### Prerequisites

From the monorepo root, ensure you have:
- Node.js >= 20.0.0
- npm >= 10.0.0
- Environment variables configured (see root README.md)

### Commands

```bash
# From monorepo root:
npm run dev:bot              # Start bot in development mode
npm run build:bot            # Build for production

# From this workspace (apps/bot):
npm run dev                  # Start bot with tsx
npm run dev:watch            # Start bot with auto-reload
npm run build                # Build with Vite
npm run test                 # Run tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage
npm run lint                 # Lint code
npm run lint:fix             # Fix auto-fixable linting issues
```

## Environment Variables

Required environment variables (set in monorepo root `.env`):

- `BOT_API_KEY` - Discord bot token
- `MONGODB_URI` - MongoDB connection string (or use MONGO_USER, MONGO_PASSWORD, MONGO_SERVER)
- `WEATHER_KEY` - OpenWeatherMap API key (for weather command)

## Adding New Commands

1. Create a new file in `commands/` directory (e.g., `commands/mycommand.ts`)
2. Export a default async function with this signature:
   ```typescript
   import { Client, TextChannel, DMChannel } from 'discord.js';
   import { User } from '../command-interface.js';

   export default async function (
     bot: Client,
     channel: TextChannel | DMChannel,
     user: User,
     ...args: string[]
   ): Promise<void> {
     // Command logic here
   }
   ```
3. Add the command to `commands.ts` registry
4. Create a test file `commands/mycommand.test.ts`

## Testing

All commands should have corresponding test files using Vitest:

```typescript
import { describe, it, expect } from 'vitest';
import myCommand from './mycommand.js';

describe('mycommand', () => {
  it('should do something', async () => {
    // Test implementation
  });
});
```

Run tests with:
```bash
npm test
```

## Code Standards

- **TypeScript**: Strict mode enabled, no `any` types allowed
- **Style**: 2-space indentation, single quotes, semicolons required
- **Naming**: camelCase for functions/variables, PascalCase for classes/interfaces
- **Error Handling**: Always use try-catch for async operations
- **Testing**: All new features must have tests

See the root [.github/copilot-instructions.md](../../.github/copilot-instructions.md) for complete coding standards.

## Dependencies

- **discord.js**: Discord API client
- **mongodb**: Database driver
- **vm2**: Sandboxed code execution for custom commands
- **tsx**: TypeScript execution for development
- **vite**: Build tool for production
- **vitest**: Testing framework
- **@praetbot/shared-lib**: Shared database and cookie utilities

## Security

- Custom commands run in sandboxed environment (vm2)
- No hardcoded credentials (use environment variables)
- Input validation for all user-provided data
- Rate limiting considerations for API calls

## License

MIT - See [LICENSE](../../LICENSE) in repository root
