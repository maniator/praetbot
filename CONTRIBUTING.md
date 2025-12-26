# Contributing to Praetbot

Thank you for your interest in contributing to Praetbot! This document provides guidelines and instructions for contributing to the project.

## 🎨 Featured Contribution Opportunity: Web Interface Design

**We need your help making the web interface beautiful!**

The current web interface is functional but minimal. We're looking for designers and frontend developers to help create a modern, engaging UI.

### What We Need

- Modern, responsive design (mobile-friendly)
- Cookie leaderboard with visual rankings
- Bot statistics dashboard
- Command browser/explorer
- Dark/light mode support
- Charts and data visualization

### Skills Needed

- HTML/CSS (Bootstrap, Tailwind, or custom)
- JavaScript/TypeScript
- UI/UX design
- Responsive design
- Accessibility best practices

**See [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) for detailed design ideas and guidelines.**

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project follows a simple code of conduct: be respectful, constructive, and collaborative. We're all here to build something great together.

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB database (for local development)
- Discord Bot Token (for testing)

### Setting Up Your Development Environment

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/praetbot.git
   cd praetbot
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   The monorepo structure with npm workspaces automatically sets up all three packages:
   - `@praetbot/bot`
   - `@praetbot/web`
   - `@praetbot/shared-lib`

3. **Set Up Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run Tests**

   ```bash
   npm test
   ```

5. **Start Development Servers**

   ```bash
   # Run both bot and web
   npm run dev

   # Or run specific workspace
   npm run dev --filter=@praetbot/bot
   npm run dev --filter=@praetbot/web
   ```

## Development Workflow

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new functionality (see "Where to Add Tests" below)
   - Update documentation as needed

3. **Run Quality Checks**

   ```bash
   # Run linting across all workspaces
   npm run lint

   # Fix auto-fixable issues
   npm run lint:fix

   # Check code formatting
   npm run format:check

   # Format all code
   npm run format

   # Run all tests
   npm test

   # Run tests with coverage
   npm run test:coverage

   # Build all workspaces
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

### Where to Add Tests

- **Bot commands**: `apps/bot/commands/<command>.test.ts`
- **Bot features**: `apps/bot/<feature>.test.ts`
- \*\*Bot routWEB_INTERFACE.md for web interface changes
  - Update DEPLOYMENT.md for deployment-related changes
  - Update CHANGELOG.md with your changes
  - Add JSDoc comments for new functions/classes

2. **Ensure CI Passes**
   - All tests must pass: `npm test`
   - Linting must pass with 0 errors: `npm run lint`
   - Code must be properly formatted: `npm run format:check`
   - TypeScript compilation must succeed: `npm run build`
   - Build artifacts must be generated for all workspaces

3. **Submit PR**
   - Provide a clear description of changes
   - Reference any related issues (#123)
     apps/web/app/users/page.tsx # Web interface

```

## Pull Request Process

1. **Update Documentation**
   - Update README.md if you've added new features
   - Update CHANGELOG.md with your changes
   - Add JSDoc comments for new functions/classes

2. **Ensure CI Passes**
   - All tests must pass
   - Linting must pass with 0 errors
   - Code must be properly formatted
   - TypeScript compilation must succeed

3. **Submit PR**
   - Provide a clear description of changes
   - Reference any related issues
   - Add screenshots for UI changes
   - Request review from maintainers

4. **Address Review Feedback**
   - Respond to comments promptly
   - Make requested changes
   - Re-request review after updates

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode features
- Avoid `any` types when possible (use specific types or `unknown`)
- Use interfaces for object shapes
- Use enums for fixed sets of values

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Line Length**: Max 100 characters
- **Arrow Functions**: Prefer arrow functions for callbacks
- **Async/Await**: Use async/await over promises when possible

### File Organization

The project uses a **Turborepo monorepo** structure with three workspaces:

```

praetbot/
├── apps/
│ ├── bot/ # Bot app (@praetbot/bot)
│ │ ├── commands/ # Command modules
│ │ ├── routes/ # Express API routes
│ │ ├── tests/ # Bot-specific tests
│ │ └── vite.config.ts # Vite build config
│ │
│ └── web/ # Web app (@praetbot/web)
│ ├── app/ # Next.js app directory
│ ├── lib/ # Re-exported utilities
│ └── next.config.ts # Next.js config
│
├── packages/
│ └── shared-lib/ # Shared lib (@praetbot/shared-lib)
│ ├── cookies.ts
│ ├── dbConnect.ts
│ ├── cookies.test.ts
│ └── dbConnect.test.ts
│
├── turbo.json # Turborepo config
└── package.json # Root monorepo config

````

**Key Points:**
- Each workspace has its own `package.json` and `tsconfig.json`
- Shared code in `packages/shared-lib` is used by both bot and web
- Build task dependencies ensure shared-lib builds before bot/web
- Turborepo handles task orchestration and caching

### Naming Conventions

- **Files**: kebab-case (e.g., `command-listener.ts`)
- **Classes**: PascalCase (e.g., `CommandListener`)
- **Functions**: camelCase (e.g., `parseCommand`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Interfaces**: PascalCase (e.g., `UserCommand`)

## Contributing to the Web Interface

### Design Contributions

We welcome design improvements to the web interface! Here's how to contribute:

1. **Review Current State**
   - Run the app locally: `npm run dev:web`
   - Visit `http://localhost:3000`
   - Check existing pages in `/web/app`

2. **Plan Your Changes**
   - Create wireframes or mockups
   - Consider mobile responsiveness
   - Ensure accessibility (WCAG 2.1)
   - Share your designs in an issue for feedback

3. **Implement Your Design**
   - Update React components in `/web/app`
   - Add styles in `/web/app/globals.css` or component-level CSS Modules
   - Add new pages by creating folders under `/web/app`
   - Ensure TypeScript types are correct

4. **Test Thoroughly**
   - Test on different screen sizes
   - Test with different data scenarios (empty, full)
   - Verify accessibility with screen readers
   - Add automated tests for new pages or API routes

5. **Document Your Changes**
   - Update `WEB_INTERFACE.md` if adding new features
   - Take screenshots of your improvements
   - Add them to `docs/screenshots/`
   - Update `docs/SCREENSHOTS.md`

### Suggested Technologies

- **CSS Frameworks**: Bootstrap, Tailwind CSS, Bulma
- **Icons**: Font Awesome, Material Icons, Feather Icons
- **Charts**: Chart.js, Recharts, D3.js
- **Real-time**: Socket.io for live updates
- **State Management**: Consider Alpine.js or HTMX for interactivity

### Example: Adding a Leaderboard Page

See [WEB_INTERFACE.md](WEB_INTERFACE.md) for detailed examples of adding new routes and pages.

## Testing Guidelines

### Writing Tests

- Place tests next to the code they test (e.g., `command.test.ts` next to `command.ts`)
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Mock external dependencies (Discord API, MongoDB)

### Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
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
````

### Coverage Requirements

- Aim for >80% code coverage
- All new features must have tests
- All bug fixes should include regression tests

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(commands): add new dice roll command

Add support for rolling multiple dice with custom sides.
Supports notation like "2d6" or "1d20".

Closes #123
```

```
fix(cookie): prevent negative cookie counts

Users can no longer have negative cookies after multiple
decrements.
```

```
docs(readme): update installation instructions

Add steps for MongoDB setup and Discord bot configuration.
```

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Reach out to the maintainers

Thank you for contributing! 🎉
