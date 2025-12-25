# Web Interface Guide

Praetbot ships with a Next.js (App Router) web interface that runs alongside the Discord bot.

## Overview
- Framework: Next.js 15 (TypeScript, App Router)
- Location: /web
- Shared code: /lib (database and cookie helpers)
- Current pages: / (home), /users (cookie leaderboard)

## Getting Started
```bash
# Start bot + web together
npm run dev

# Start web only
npm run dev:web

# Start bot only
npm run dev:bot
```
The web interface is available at http://localhost:3000.

### Environment Variables
- MONGODB_URI (required for build and runtime data access)

## Current Pages
- / – Home page with Praetbot info
- /users – Cookie leaderboard rendered as a table

## Adding a Page
Create a folder under /web/app following Next.js conventions:
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
The route becomes available at /about automatically.

## Creating an API Route (optional)
```typescript
// /web/app/api/cookies/route.ts
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
Available at /api/cookies.

## Styling
- Global styles: /web/app/globals.css
- Component styles: CSS Modules or inline styles
- Static assets: /web/public

## Deployment
- vercel.json installs and builds in /web:
  - installCommand: cd web && npm install
  - buildCommand: cd web && npm run build
- Ensure MONGODB_URI is set in the hosting environment.

## Troubleshooting
- Blank deploy: confirm Vercel uses repo root with provided vercel.json.
- Database errors: verify MONGODB_URI is configured.
- Path issues: use @/lib/... imports inside /web for shared utilities.
