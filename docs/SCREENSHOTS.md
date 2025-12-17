# Screenshots

## Web Interface

### Home Page

![Home Page](screenshots/home-page.png)

*The main landing page of the Praetbot web interface.*

### Cookie Leaderboard

![Cookie Leaderboard](screenshots/users-endpoint.png)

*JSON endpoint showing users and their cookie counts at `/users`.*

---

## Discord Bot

### Cookie System in Action

![Cookie System](screenshots/discord-cookies.png)

*Users giving cookies to each other with `@user ++` and `@user --` commands.*

### Built-in Commands

![Commands](screenshots/discord-commands.png)

*Examples of built-in commands like `!!help`, `!!weather`, and `!!xkcd`.*

### Custom Commands

![Custom Commands](screenshots/discord-custom-commands.png)

*Adding and using custom commands with `!!addCommand`.*

---

## 🎨 Help Wanted: Web Interface Design

**The current web interface is functional but minimal (Express + Handlebars). We need your input!**

### Current State

- Basic Express server with Handlebars templates
- Minimal styling
- JSON API endpoints (`/users`)
- Works, but not pretty

### What Should We Use?

**We'd love your opinion on the frontend stack:**

#### Option 1: Keep It Simple
- Enhance existing Handlebars templates
- Add Bootstrap/Tailwind CSS
- Vanilla JavaScript for interactivity
- **Pros**: Lightweight, simple, no build step
- **Cons**: Less modern, harder to maintain complex UIs

#### Option 2: Modern SPA Framework
- **React** + Vite
- **Vue.js** + Vite
- **Svelte** + SvelteKit
- **Solid.js**
- **Pros**: Rich ecosystem, great DX, component-based
- **Cons**: Requires build step, heavier

#### Option 3: Static Site Generator
- **Next.js** (React)
- **Gatsby** (React)
- **Astro** (framework-agnostic)
- **Nuxt** (Vue)
- **Pros**: Best performance, SEO-friendly
- **Cons**: May be overkill for our use case

#### Option 4: Full-Stack Meta Framework
- **Remix** (React)
- **SvelteKit** (Svelte)
- **SolidStart** (Solid)
- **Pros**: Server + client in one, great DX
- **Cons**: More complex setup

#### Option 5: HTMX/Alpine.js
- Keep server-side rendering
- Add **HTMX** for dynamic content
- **Alpine.js** for lightweight interactivity
- **Pros**: Simple, progressive enhancement
- **Cons**: Less powerful than full frameworks

### What We're Looking For

Regardless of framework choice:

- Modern, responsive design
- Cookie leaderboard with rankings and stats
- Command browser/explorer
- Bot statistics dashboard
- Dark/light mode toggle
- Mobile-friendly interface
- Good accessibility (WCAG 2.1)

### How to Contribute Your Opinion

1. **GitHub Discussions**: Share your thoughts on framework choice
2. **Submit a Proposal**: Open an issue with your preferred stack and why
3. **Prototype**: Build a quick demo with your preferred framework
4. **Vote**: We'll create a poll once we have several options

### Design Ideas (Framework-Agnostic)

Some suggestions for improvement:

- **UI Components**: Choose a library that fits the framework
  - React: Chakra UI, shadcn/ui, Material UI
  - Vue: Vuetify, PrimeVue, Headless UI
  - Svelte: Skeleton, Flowbite Svelte
- **Charts**: Cookie distribution, activity over time
- **Real-time Updates**: Live leaderboard with WebSockets
- **User Profiles**: Individual pages with stats and history
- **Search & Filter**: Find users, sort by metrics
- **Theming**: Dark mode, custom themes
- **Accessibility**: Keyboard navigation, screen reader support

### Contributing Designs

If you have design skills (regardless of implementation):

- Wireframes (Figma, Sketch, Balsamiq)
- Mockups (high-fidelity designs)
- Interactive prototypes
- Style guides and design systems
- Component libraries

**Share your work:**
- Post in GitHub Discussions
- Link in an issue
- Submit a PR with designs in `docs/designs/`

### Implementation Contributions

Want to build it yourself? We'd love that!

1. **Choose your framework** (or propose one)
2. **Fork the repository**
3. **Build your version** (can live alongside current Express app)
4. **Document your approach**
5. **Submit a PR** with:
   - Your implementation
   - Screenshots
   - Setup instructions
   - Rationale for framework choice

We can maintain multiple frontend options and let the community choose!

---

## Contributing Screenshots

When adding screenshots:

1. **Use high resolution** (1920x1080 or similar)
2. **Crop appropriately** to show relevant content
3. **Use PNG format** for UI screenshots
4. **Redact sensitive information** (user IDs, tokens, etc.)
5. **Name descriptively** (e.g., `leaderboard-dark-mode.png`)

Place screenshots in `docs/screenshots/` directory.

---

## Let's Discuss!

Join the conversation:
- [GitHub Discussions](https://github.com/maniator/praetbot/discussions)
- Open an issue with tag `frontend` or `design`
- Discord community (coming soon)

*Note: Screenshots will be added as the web interface is developed and improved. All contributions welcome!*
