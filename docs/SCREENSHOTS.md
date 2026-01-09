# Screenshots

## Web Interface

### Home Page

![Home Page](screenshots/home-page.png)

_The main landing page of the Praetbot web interface._

### Cookie Leaderboard

![Cookie Leaderboard](screenshots/users-endpoint.png)

_JSON endpoint showing users and their cookie counts at `/users`._

---

## Discord Bot

### Cookie System in Action

![Cookie System](screenshots/discord-cookies.png)

_Users giving cookies to each other with `@user ++` and `@user --` commands._

### Built-in Commands

![Commands](screenshots/discord-commands.png)

_Examples of built-in commands like `!!help`, `!!weather`, and `!!xkcd`._

### Custom Commands

![Custom Commands](screenshots/discord-custom-commands.png)

_Adding and using custom commands with `!!addCommand`._

---

## 🎨 Help Wanted: Web Interface Design

**The web interface uses Next.js 15 with minimal styling. We need your design expertise!**

### Current State

- Next.js 15 with App Router
- TypeScript and React Server Components
- Minimal styling (ready for enhancement)
- Server-side rendering
- Cookie leaderboard at `/users`

### What Should We Add?

**We'd love design contributions using modern React/Next.js tools:**

#### Styling Options

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Material UI (MUI)** - Comprehensive component library
- **Chakra UI** - Simple, modular components
- **Mantine** - Feature-rich React components
- **Custom CSS** - Your own design system

#### Component Libraries

- Pre-built UI components for faster development
- Consistent design language
- Accessibility built-in
- Dark mode support

**Pros:**

- Modern React/Next.js ecosystem
- Rich component libraries
- Great developer experience
- Active community

**Cons:**

- Need to choose from many options
- May require learning new libraries

### What We're Building

With Next.js as our foundation, we want to add:

- Modern, responsive design
- Cookie leaderboard with rankings and stats
- Command browser/explorer
- Bot statistics dashboard
- Dark/light mode toggle
- Mobile-friendly interface
- Good accessibility (WCAG 2.1)

### How to Contribute Your Design Skills

1. **GitHub Discussions**: Share your design ideas and proposals
2. **Submit a PR**: Add styling with your preferred library (Tailwind, shadcn/ui, etc.)
3. **Prototype**: Build new pages or components
4. **Design System**: Create mockups and design guidelines

### Design Ideas for Next.js

Some suggestions for improvement:

- **UI Components**: Choose a React component library
  - shadcn/ui (highly recommended for Next.js)
  - Chakra UI
  - Material UI
  - Mantine
  - Headless UI + Tailwind
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

Want to enhance the Next.js interface? We'd love that!

1. **Choose your styling approach** (Tailwind, component library, custom CSS)
2. **Fork the repository**
3. **Build your enhancements** in the `apps/web` directory
4. **Document your approach**
5. **Submit a PR** with:
   - Your implementation
   - Screenshots
   - Setup instructions (if adding new dependencies)
   - Rationale for library choices

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

_Note: Screenshots will be added as the web interface is developed and improved. All contributions welcome!_
