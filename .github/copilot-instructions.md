# Copilot Instructions for Praetbot

These instructions provide GitHub Copilot with repository-specific guidance, coding standards, and best practices for this project.

## Project Overview

Praetbot is a Discord bot built with TypeScript, featuring custom commands, cookie tracking, and various utilities. It includes both a Discord bot and an Express web interface.

**Primary Technologies:**
- Runtime: Node.js >= 20.0.0
- Language: TypeScript 5.7.2
- Discord API: Discord.js v14
- Database: MongoDB 6.11.0
- Web Framework: Express 4.21.2
- Testing: Vitest 2.1.8
- Build Tool: Vite 6.0.3
- Linting: ESLint 9.17.0
- Formatting: Prettier 3.4.2

## Coding Standards

### TypeScript

- Use TypeScript for all code (no JavaScript files except configs)
- Enable strict mode features as configured in tsconfig.json
- **NEVER use `any` type** - it's an error in ESLint config
- Use specific types or `unknown` when type is unclear
- Use interfaces for object shapes (see `Command` and `User` in `bot/command-interface.ts`)
- Target ES2022 with ESNext modules
- Always enable strict null checks and strict function types

### Code Style

- **Indentation**: 2 spaces (never tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Always required
- **Line Length**: Maximum 100 characters
- **Arrow Functions**: Prefer arrow functions for callbacks
- **Async/Await**: Use async/await over promises
- **Const vs Let**: Use `const` by default, `let` only when reassignment needed
- **No `var`**: Always use `const` or `let`
- **Equality**: Use `===` and `!==` (strict equality only)
- **Curly Braces**: Always use curly braces for all control structures
- **Error Handling**: Never throw literals, always throw Error objects
- **Trailing Commas**: Use ES5 style trailing commas
- **Arrow Parens**: Always use parentheses around arrow function parameters
- **End of Line**: LF (Unix-style)

### Naming Conventions

- **Files**: kebab-case (e.g., `command-interface.ts`, `sandbox.test.ts`)
- **Classes**: PascalCase (e.g., `CommandListener`)
- **Functions**: camelCase (e.g., `parseCommand`, `rollCommand`)
- **Variables**: camelCase (e.g., `userId`, `messageContent`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `BOT_PREFIX`)
- **Interfaces**: PascalCase (e.g., `Command`, `User`)
- **Type Aliases**: PascalCase
- **Unused Variables**: Prefix with underscore (e.g., `_bot`, `_unusedParam`)

## File Organization

```
bot/
├── index.ts              # Main bot class
├── command.ts            # Command listener
├── commands.ts           # Built-in commands registry
├── commands/             # Individual command modules
│   ├── roll.ts
│   ├── weather.ts
│   └── *.test.ts        # Tests alongside implementation
├── command-interface.ts  # Type definitions
├── message.ts           # Message handling
├── sandbox.ts           # Sandboxed code execution
└── types.ts             # Shared types

routes/
├── index.ts             # Home route
└── users.ts             # User data routes

views/                   # Handlebars templates
public/                  # Static files
```

## Command Pattern

All Discord bot commands follow this pattern:

1. Export a default async function
2. Function signature: `(bot: Client, channel: TextChannel | DMChannel, user: User, ...args: string[]) => Promise<void>`
3. Handle both TextChannel and DMChannel types appropriately
4. Use try-catch for error handling
5. Return user-friendly error messages
6. Place tests in `.test.ts` files alongside implementation

Example command structure:

```typescript
import { Client, TextChannel, DMChannel } from 'discord.js';
import { User } from '../command-interface.js';

export default async function (
  bot: Client,
  channel: TextChannel | DMChannel,
  user: User,
  ...args: string[]
): Promise<void> {
  try {
    // Command logic here
    const response = await processCommand(args);
    await channel.send(`<@${user.id}> ${response}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    await channel.send(`<@${user.id}> Error: ${errorMessage}`);
  }
}
```

## Testing Guidelines

### Framework

- Use Vitest for all tests
- Place test files alongside implementation with `.test.ts` extension
- Use descriptive test names that explain what is being tested

### Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('FeatureName', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Test Requirements

- All new features must have tests
- All bug fixes should include regression tests
- Mock external dependencies (Discord API, MongoDB)
- Aim for >80% code coverage
- In test files, `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` are disabled

## Development Workflow

### Available Commands

```bash
npm run dev              # Start bot in development mode
npm run dev:watch        # Start bot with auto-reload
npm run dev:web          # Start web interface only
npm run dev:web:watch    # Start web interface with auto-reload
npm run build            # Build for production
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run lint             # Lint code
npm run lint:fix         # Fix auto-fixable linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Before Committing

1. Run `npm run lint` to check for linting errors
2. Run `npm run format:check` to verify formatting
3. Run `npm test` to ensure all tests pass
4. Fix any issues before committing

## Security Best Practices

### Critical Rules

- **NEVER commit** `.env` files or secrets to version control
- **NEVER hardcode** API keys, tokens, or passwords in source code
- **ALWAYS store** sensitive data in environment variables
- **NEVER use `any` type** - it's blocked by ESLint to prevent type safety issues

### Environment Variables

All configuration should be in environment variables:
- `BOT_API_KEY` - Discord bot token
- `MONGO_USER` - MongoDB username
- `MONGO_PASSWORD` - MongoDB password
- `MONGO_SERVER` - MongoDB server connection string
- `WEATHER_KEY` - OpenWeatherMap API key

### Custom Commands

- Custom commands use vm2 for sandboxed execution
- Only trusted users should have access to `!!addCommand`
- Audit custom commands regularly for malicious code
- Consider implementing role-based access control

### Dependencies

- Keep all dependencies updated
- Review dependency security advisories
- Use `npm audit` to check for vulnerabilities
- Avoid introducing outdated libraries that don't fit the modern tech stack

## Discord.js Specifics

### Required Intents

The bot uses these Discord.js GatewayIntentBits:
- `GatewayIntentBits.Guilds` - Access guild information
- `GatewayIntentBits.GuildMessages` - Read messages in guilds
- `GatewayIntentBits.MessageContent` - Access message content (privileged)
- `GatewayIntentBits.GuildMembers` - Access member information
- `GatewayIntentBits.DirectMessages` - Send DMs to users

### Channel Types

- Check channel type before guild-specific operations
- Handle both TextChannel and DMChannel appropriately
- Type 0 = GUILD_TEXT channel

### User Mentions

- Use `<@${user.id}>` for mentioning users in responses
- Filter out bots when selecting random users
- Escape special characters in Discord messages as needed (note: `no-useless-escape` is disabled for this reason)

## Express Web Interface

### Routes

- Place route handlers in `routes/` directory
- Use Handlebars templates in `views/` directory
- Serve static files from `public/` directory
- Main Express app is in `eApp.ts`

### Design Principles

- Keep web interface functional but simple
- Ensure mobile responsiveness
- Consider accessibility (WCAG 2.1)
- Use semantic HTML
- Future consideration: modern frontend framework

## Module System

- Use ES modules (not CommonJS)
- Import statements use `.js` extension even for `.ts` files (for compatibility)
- Use named exports for utilities, default exports for commands
- Type: "module" in package.json

## Console and Debugging

- `console.log` is allowed (no-console is off)
- Use `console.error` for error logging
- **NEVER use `debugger`** statements (error in ESLint)
- **NEVER use `alert()`** (error in ESLint)

## Ignore Patterns

Do not modify or generate suggestions for:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `coverage/` - Test coverage reports
- Generated JavaScript files in config (`.js`, `.mjs`, `.cjs`)

## Commit Message Format

Follow Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
- `feat(commands): add dice roll command`
- `fix(cookie): prevent negative cookie counts`
- `docs(readme): update installation instructions`

## Contribution Guidelines

- Fork the repository and create feature branches
- Update documentation for new features
- Add JSDoc comments for new functions/classes
- Update CHANGELOG.md with changes
- Ensure CI passes (linting, tests, type checking, build)
- Request review from maintainers

## Additional Notes

- This is a community-driven project - contributions welcome
- Web interface is minimal by design - open to design improvements
- Custom commands showcase creativity - see community discussions
- Support Node.js >= 20.0.0 and npm >= 10.0.0
