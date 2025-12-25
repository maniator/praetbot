# Turborepo Monorepo Guide

Praetbot uses **Turborepo** to manage a monorepo with three independent workspaces.

## Why Turborepo?

Turborepo provides:
- **Task orchestration**: Automatically handles build order and parallelization
- **Intelligent caching**: Skips rebuilds if nothing changed
- **Workspace isolation**: Each package has independent dependencies and configuration
- **Scalability**: Easy to add more packages as the project grows

## Workspace Structure

```
praetbot/
├── apps/
│   ├── bot/                  # Discord bot (@praetbot/bot)
│   └── web/                  # Next.js web interface (@praetbot/web)
├── packages/
│   └── shared-lib/           # Shared utilities (@praetbot/shared-lib)
├── package.json              # Root monorepo config
├── turbo.json                # Turborepo configuration
└── tsconfig.json             # Root TypeScript configuration
```

### @praetbot/bot

**Discord bot application with Vite build and Vitest tests**

```
apps/bot/
├── app.ts                    # Entry point
├── index.ts                  # Bot class
├── command.ts                # Command listener
├── commands.ts               # Built-in commands registry
├── commands/                 # Individual command modules
├── routes/                   # Express API routes
├── tests/                    # Bot-specific tests
├── sandbox.ts                # Sandboxed code execution (vm2)
├── vite.config.ts            # Vite build configuration
├── vitest.config.ts          # Vitest test configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Bot dependencies
```

**Key Dependencies:**
- discord.js (Discord API)
- express (legacy HTTP server)
- mongodb (database client)
- vm2 (sandboxed code execution)
- vite (build tool)
- vitest (test framework)

**Build Output:**
- `apps/bot/dist/app.js` - Bundled application

### @praetbot/web

**Next.js 15 web interface for dashboard and monitoring**

```
apps/web/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page
│   ├── users/               # Users route
│   │   └── page.tsx         # Cookie leaderboard
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── lib/                      # Re-exported utilities
│   ├── cookies.ts           # Cookie operations re-export
│   └── dbConnect.ts         # Database connection re-export
├── public/                   # Static assets
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Web dependencies
```

**Key Dependencies:**
- next (React framework)
- react/react-dom (UI framework)
- @praetbot/shared-lib (shared utilities)
- mongodb (database client)

**Build Output:**
- `apps/web/.next/` - Next.js build directory

### @praetbot/shared-lib

**Shared MongoDB utilities used by both bot and web**

```
packages/shared-lib/
├── cookies.ts               # Cookie CRUD operations
├── cookies.test.ts          # Cookie tests (moved from bot)
├── dbConnect.ts             # MongoDB connection handler
├── dbConnect.test.ts        # Connection tests (moved from bot)
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
└── package.json             # Library dependencies
```

**Exports:**
```json
{
  "exports": {
    "./cookies": {
      "import": "./dist/cookies.js",
      "types": "./dist/cookies.d.ts"
    },
    "./dbConnect": {
      "import": "./dist/dbConnect.js",
      "types": "./dist/dbConnect.d.ts"
    }
  }
}
```

**Build Output:**
- `packages/shared-lib/dist/` - Compiled JavaScript and type definitions

## Dependency Management

### Workspace Dependencies

Each workspace can depend on other workspaces using package names:

```json
// apps/bot/package.json
{
  "dependencies": {
    "@praetbot/shared-lib": "*"
  }
}

// apps/web/package.json
{
  "dependencies": {
    "@praetbot/shared-lib": "*"
  }
}
```

The `*` version specifier means "use the local workspace version".

### npm Workspaces

The root `package.json` defines workspaces:

```json
{
  "workspaces": [
    "apps/bot",
    "apps/web",
    "packages/shared-lib"
  ],
  "packageManager": "npm@10.8.1"
}
```

**Benefits:**
- Single `node_modules` at root (dependencies deduplicated)
- `npm install` installs all workspaces
- Workspaces automatically linked for development
- Simplified dependency management

## Task Orchestration

### Turborepo Configuration

The `turbo.json` file defines tasks and their dependencies:

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", ".next/**"],
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    "lint": {
      "outputs": [],
      "cache": false
    },
    "test": {
      "outputs": ["coverage/**"],
      "cache": false
    }
  }
}
```

### Task Dependencies

- `^build` means "run build in dependencies first"
- `build` task in bot/web depends on `build` in shared-lib
- `dev` and lint tasks run in parallel across workspaces

### Running Tasks

```bash
# Run task in all workspaces
npm run build

# Run task in specific workspace
npm run build --filter=@praetbot/bot
npm run build --filter=@praetbot/web
npm run build --filter=@praetbot/shared-lib

# Run task excluding a workspace
npm run test --filter=!@praetbot/web
```

### Task Outputs

Some tasks generate artifacts:

| Task | Outputs | Caching |
|------|---------|---------|
| build | dist/, .next/, .vercel | Enabled |
| test | coverage/ | Disabled |
| lint | - | Disabled |
| dev | - | Disabled (persistent) |

## Development Workflow

### Installation

```bash
# Install all dependencies for all workspaces
npm install
```

This command:
1. Creates single `node_modules` at root
2. Links workspace packages to each other
3. Installs external dependencies

### Development Servers

```bash
# Start all dev servers (bot + web)
npm run dev

# Start specific workspace
npm run dev --filter=@praetbot/bot
npm run dev --filter=@praetbot/web
```

### Building

```bash
# Build all workspaces (with dependency order)
npm run build

# Build specific workspace + dependencies
npm run build:bot    # builds shared-lib + bot
npm run build:web    # builds shared-lib + web

# Build only shared-lib
npm run build --filter=@praetbot/shared-lib
```

**Build Order:**
1. shared-lib compiles TypeScript → JavaScript
2. bot and web build in parallel using compiled shared-lib

### Testing

```bash
# Run all tests
npm test

# Run tests for specific workspace
npm test --filter=@praetbot/bot
npm test --filter=@praetbot/shared-lib

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Lint all workspaces
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format
```

## Import Paths

### From Bot to shared-lib

The bot uses **relative paths** to import from shared-lib (to avoid Vite module resolution issues):

```typescript
// apps/bot/index.ts
import { getCookieByUserId } from '../../packages/shared-lib/cookies';
import { connect } from '../../packages/shared-lib/dbConnect';
```

### From Web to shared-lib

The web uses **package imports** (Next.js handles this correctly):

```typescript
// apps/web/lib/cookies.ts
export { ... } from '@praetbot/shared-lib/cookies';
```

### From Components

Within each workspace, use standard imports:

```typescript
// apps/web/app/users/page.tsx
import { getCookies } from '@/lib/cookies';

// apps/bot/index.ts
import { listCommands } from './commands';
```

## Adding a New Workspace

To add a new workspace (e.g., `apps/api`):

1. **Create directory structure:**
   ```bash
   mkdir -p apps/api/src
   cd apps/api
   npm init -y
   ```

2. **Update root `package.json`:**
   ```json
   {
     "workspaces": [
       "apps/bot",
       "apps/web",
       "apps/api",  // Add here
       "packages/shared-lib"
     ]
   }
   ```

3. **Create workspace config files:**
   - `tsconfig.json`
   - `package.json` with workspace name
   - Task scripts (build, dev, test, lint)

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Add to Turborepo:**
   - Update `turbo.json` with new tasks if needed
   - Specify task dependencies

## Monorepo Best Practices

### Dependency Management

✅ **DO:**
- Use exact versions for external dependencies
- Use `*` for workspace dependencies
- Regularly update dependencies

❌ **DON'T:**
- Use different versions of same package in different workspaces
- Add unnecessary dependencies to root
- Forget to install before running tasks

### Code Organization

✅ **DO:**
- Keep shared code in `packages/`
- Keep app-specific code in `apps/`
- Use clear package names with `@` scope
- Document workspace responsibilities

❌ **DON'T:**
- Mix shared and app-specific code
- Create circular dependencies
- Use relative paths that escape workspace bounds

### Build and Test

✅ **DO:**
- Run full build before committing: `npm run build`
- Run tests for affected workspaces: `npm test`
- Use Turborepo filters for faster CI: `npm run lint --filter=@praetbot/bot`
- Cache build outputs appropriately

❌ **DON'T:**
- Build individual workspaces without building dependencies
- Skip tests before PR
- Assume local changes don't affect other workspaces

## Troubleshooting

### "Module not found: @praetbot/shared-lib"

**Cause:** npm install incomplete or workspace not properly linked

**Solution:**
```bash
npm install
npm run build --filter=@praetbot/shared-lib
```

### Build fails for one workspace

**Cause:** Dependency not installed or version mismatch

**Solution:**
```bash
npm install
npm run build  # Full build ensures proper order
```

### Tests fail after changes to shared-lib

**Cause:** Cached test results or shared-lib not rebuilt

**Solution:**
```bash
npm run build
npm test
```

### Environment variables not available

**Cause:** Variables not set in workspace execution context

**Solution:**
- Check `.env` file exists at root
- Verify variables are exported: `export VAR=value`
- Restart dev server

## Comparison: Before vs After Turborepo

### Before (Legacy Single-Root)

```
praetbot/
├── bot/          # Bot code mixed with tests
├── lib/          # Shared code in monolithic folder
├── web/          # Web code with symlinks
├── package.json  # Single dependency list
└── tsconfig.json # Single TypeScript config
```

**Issues:**
- Import paths were confusing (`../../../lib`)
- Module resolution issues on Vercel
- Shared code versioning unclear
- Builds were manual orchestration

### After (Turborepo)

```
praetbot/
├── apps/bot/          # Independent bot workspace
├── apps/web/          # Independent web workspace
├── packages/shared-lib/ # Proper shared package
├── package.json       # Root monorepo config
├── turbo.json         # Automatic task orchestration
└── tsconfig.json      # Root TypeScript extends
```

**Benefits:**
- Clear dependency graph
- Automatic build ordering
- Proper module scoping
- Vercel deployment works correctly
- Easier to add new packages

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

## Getting Help

- Check [GitHub Issues](https://github.com/maniator/praetbot/issues)
- Review this guide and CONTRIBUTING.md
- Ask in project discussions
