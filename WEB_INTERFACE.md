# Web Interface Guide

Praetbot ships with a modern Next.js (App Router) web interface that runs alongside the Discord bot as part of the Turborepo monorepo.

## Overview

- **Framework**: Next.js 15 with TypeScript and App Router
- **Location**: `apps/web/`
- **Shared Code**: `packages/shared-lib/` (database and cookie helpers)
- **Current Pages**: `/` (home), `/users` (cookie leaderboard)
- **Package Name**: `@praetbot/web`

## Getting Started

```bash
# Start both bot and web together
npm run dev

# Start web only (uses Turborepo filter)
npm run dev --filter=@praetbot/web

# Start bot only
npm run dev --filter=@praetbot/bot

# Build web for production
npm run build:web
```

The web interface is available at http://localhost:3000.

### Environment Variables

Required for both development and deployment:
- `MONGODB_URI` (required for build and runtime data access)
- `MONGODB_DB` (optional; defaults to `praetbot`)

## Monorepo Integration

The web app is part of a Turborepo monorepo structure:

```
apps/
├── bot/          # Discord bot (@praetbot/bot)
└── web/          # Web interface (@praetbot/web)
packages/
└── shared-lib/   # Shared utilities (@praetbot/shared-lib)
```

### Using Shared Library

The web app depends on `@praetbot/shared-lib` for database operations:

```typescript
// apps/web/lib/cookies.ts
export { updateCookie, getCookies, getCookieByUserId, type CookieUser } from '@praetbot/shared-lib/cookies';

// apps/web/lib/dbConnect.ts
export { connect } from '@praetbot/shared-lib/dbConnect';
```

These are re-exported for convenience in the web app and can be used in API routes and components.

## Current Pages

- / – Home page with Praetbot info
- /users – Cookie leaderboard rendered as a table

## Adding a Page

Create a folder under `apps/web/app/` following Next.js conventions:

```typescript
// apps/web/app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Praetbot</h1>
      <p>Your content here</p>
    </main>
  );
}
```

The route becomes available at `/about` automatically.

## Creating an API Route

```typescript
// apps/web/app/api/cookies/route.ts
import { NextResponse } from 'next/server';
import { getCookies } from '@/lib/cookies';

export async function GET() {
  try {
    const cookies = await getCookies();
    return NextResponse.json(cookies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cookies' }, { status: 500 });
  }
}
```

Available at `/api/cookies`.

## Styling

- **Global Styles**: `apps/web/app/globals.css`
- **Component Styles**: CSS Modules or inline styles
- **Static Assets**: `apps/web/public/`

## Building for Production

The web interface is built as part of the monorepo build process:

```bash
# Build all workspaces including web
npm run build

# Build web only
npm run build:web
```

Build output is generated in `apps/web/.next/`.

### Turborepo Build Process

1. `shared-lib` builds first (TypeScript → JavaScript)
2. `bot` and `web` build in parallel using the compiled shared-lib
3. Build caching is enabled for faster rebuilds

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel or other platforms.

### Vercel Deployment

The `vercel.json` configuration is set up for monorepo deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ],
  "installCommand": "npm install",
  "buildCommand": "npm run build:web",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/apps/web/$1"
    }
  ]
}
```

Ensure `MONGODB_URI` is set in Vercel environment variables.

## Troubleshooting

- **Blank Deploy**: Confirm Vercel uses repo root with provided vercel.json
- **Database Errors**: Verify MONGODB_URI is configured in environment
- **Module Not Found**: Ensure `@praetbot/shared-lib` dependency is installed (`npm install`)
- **Build Failures**: Check that shared-lib builds successfully first (`npm run build --filter=@praetbot/shared-lib`)
