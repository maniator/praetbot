# Praetbot Shared Library

Shared TypeScript library containing common utilities used by both the Discord bot and web interface.

## Overview

This workspace provides shared functionality for database connectivity and cookie operations, ensuring consistent behavior across the monorepo.

## Features

- **Database Connection**: MongoDB connection management with connection pooling
- **Cookie Operations**: CRUD operations for user cookie tracking
- **Type Safety**: Full TypeScript support with exported type definitions
- **Tested**: Comprehensive test coverage with Vitest

## Technology Stack

- **Language**: TypeScript 5.7.2
- **Database**: MongoDB 6.11.0
- **Testing**: Vitest 2.1.8
- **Module System**: ES Modules with proper exports

## Exports

This package exports two main modules:

### dbConnect

MongoDB connection utility with connection pooling and automatic reconnection.

```typescript
import { dbConnect } from '@praetbot/shared-lib/dbConnect';

const db = await dbConnect();
```

### cookies

Cookie management operations for user tracking.

```typescript
import { getCookies, addCookie, removeCookie } from '@praetbot/shared-lib/cookies';

// Get user's cookie count
const cookies = await getCookies(userId);

// Add cookies to user
await addCookie(userId, amount);

// Remove cookies from user
await removeCookie(userId, amount);
```

## Project Structure

```
packages/shared-lib/
├── dbConnect.ts           # MongoDB connection management
├── dbConnect.test.ts      # Database connection tests
├── cookies.ts             # Cookie operations
├── cookies.test.ts        # Cookie operation tests
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Test configuration
```

## Development

### Commands

```bash
# From monorepo root (recommended):
npm run build                # Build all workspaces including shared-lib
npm test                     # Run all tests including shared-lib

# From this workspace (packages/shared-lib):
npm run build                # Compile TypeScript to dist/
npm run test                 # Run tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage
```

## Building

The library is built using TypeScript compiler (`tsc`):

```bash
npm run build
```

This generates:
- `dist/dbConnect.js` and `dist/dbConnect.d.ts`
- `dist/cookies.js` and `dist/cookies.d.ts`

## Usage in Other Workspaces

### In package.json

```json
{
  "dependencies": {
    "@praetbot/shared-lib": "*"
  }
}
```

### In TypeScript/JavaScript

```typescript
// Import database connection
import { dbConnect } from '@praetbot/shared-lib/dbConnect';

// Import cookie operations
import { getCookies, addCookie, removeCookie } from '@praetbot/shared-lib/cookies';
```

## Environment Variables

The library uses these environment variables (set in monorepo root `.env`):

- `MONGODB_URI` - Full MongoDB connection string (preferred)
- `MONGO_USER` - MongoDB username (fallback)
- `MONGO_PASSWORD` - MongoDB password (fallback)
- `MONGO_SERVER` - MongoDB server connection string (fallback)

## Testing

All exports have corresponding test files using Vitest:

```bash
npm run test
```

Test files are co-located with implementation:
- `dbConnect.test.ts` - Database connection tests
- `cookies.test.ts` - Cookie operation tests

## API Documentation

### dbConnect()

Establishes connection to MongoDB database.

```typescript
async function dbConnect(): Promise<Db>
```

**Returns**: MongoDB `Db` instance

**Environment Variables**:
- `MONGODB_URI` (preferred) or
- `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_SERVER`

### getCookies(userId)

Retrieves cookie count for a user.

```typescript
async function getCookies(userId: string): Promise<number>
```

**Parameters**:
- `userId` - Discord user ID

**Returns**: Number of cookies the user has

### addCookie(userId, amount)

Adds cookies to a user's count.

```typescript
async function addCookie(userId: string, amount: number): Promise<void>
```

**Parameters**:
- `userId` - Discord user ID
- `amount` - Number of cookies to add

### removeCookie(userId, amount)

Removes cookies from a user's count.

```typescript
async function removeCookie(userId: string, amount: number): Promise<void>
```

**Parameters**:
- `userId` - Discord user ID
- `amount` - Number of cookies to remove

## Code Standards

- **TypeScript**: Strict mode enabled
- **Style**: 2-space indentation, single quotes, semicolons required
- **Exports**: Explicit package.json exports for tree-shaking
- **Testing**: All exported functions must have tests

See the root [.github/copilot-instructions.md](../../.github/copilot-instructions.md) for complete coding standards.

## Dependencies

### Runtime
- `mongodb@^6.11.0` - MongoDB driver for Node.js

### Development
- `typescript@^5.7.2` - TypeScript compiler
- `vitest@^2.1.8` - Testing framework
- `@vitest/coverage-v8@^2.1.8` - Code coverage

## License

MIT - See [LICENSE](../../LICENSE) in repository root
