# Setting Up the Praetbot Wiki

This guide explains how to enable and populate the Praetbot GitHub Wiki with the provided templates.

## Enable the Wiki

1. Go to your repository on GitHub
2. Click **Settings** (requires admin access)
3. Scroll to **Features** section
4. Check the box for **Wikis**
5. Click **Save**

## Access the Wiki

Once enabled:

1. Click the **Wiki** tab in your repository
2. Click **Create the first page**

## Create Wiki Pages

Use the templates in `.github/WIKI_TEMPLATES/` to create these pages:

### Required Pages

1. **Home** (landing page)
   - Use: `Home.md`
2. **Community Commands**
   - Use: `Community-Commands.md`
3. **Awesome Praetbot Commands**
   - Use: `Awesome-Praetbot-Commands.md`
4. **Deployment Guides**
   - Use: `Deployment-Guides.md`
5. **Troubleshooting**
   - Use: `Troubleshooting.md`
6. **FAQ**
   - Use: `FAQ.md`

### How to Add Each Page

1. In the Wiki, click **New Page**
2. Enter the page title (e.g., "Community Commands")
3. Copy content from the corresponding template file
4. Paste into the editor
5. Click **Save Page**

## Wiki Structure

Recommended sidebar (edit `_Sidebar.md`):

```markdown
**Home**

- [Home](Home)
- [Getting Started](Getting-Started)

**Commands**

- [Built-in Commands](Built-in-Commands)
- [Community Commands](Community-Commands)
- [Awesome Commands](Awesome-Praetbot-Commands)

**Deployment**

- [Quick Start](Quick-Start)
- [Deployment Guides](Deployment-Guides)
- [Docker Setup](Docker-Setup)

**Help**

- [FAQ](FAQ)
- [Troubleshooting](Troubleshooting)
- [Migration Guide](Migration-Guide)

**Contributing**

- [How to Contribute](Contributing)
- [Style Guide](Style-Guide)
```

## Maintain the Wiki

### Allow Community Contributions

Option 1: **Restrict to Collaborators** (more controlled)

- Settings > Options > Wiki
- Uncheck "Restrict editing to collaborators only"

Option 2: **Open to Everyone** (more contributions, needs moderation)

- Anyone can edit
- Monitor recent changes
- Revert vandalism if needed

### Keep It Updated

- Review wiki edits regularly
- Sync with code changes
- Update when features are added
- Remove outdated information

## Clone the Wiki for Editing

GitHub wikis are Git repositories:

```bash
# Clone the wiki
git clone https://github.com/maniator/praetbot.wiki.git

# Make changes
cd praetbot.wiki
# Edit markdown files

# Commit and push
git add .
git commit -m "Update wiki pages"
git push
```

## Link to Wiki from Main Repo

Update `README.md`:

```markdown
## Documentation

- [Wiki](https://github.com/maniator/praetbot/wiki) - Community guides and resources
- [API Documentation](API.md)
- [Contributing Guide](CONTRIBUTING.md)
```

## Wiki vs Docs Folder

**Use Wiki for:**

- Community-contributed content
- Tutorials and guides
- FAQ and troubleshooting
- Command collections
- Deployment stories

**Use `/docs` folder for:**

- Official documentation
- API references
- Architecture diagrams
- Contribution guidelines

## Backup the Wiki

The wiki is a separate Git repository, so:

```bash
# Backup script
git clone https://github.com/maniator/praetbot.wiki.git wiki-backup
cd wiki-backup
tar -czf ../wiki-backup-$(date +%Y%m%d).tar.gz .
```

## Popular Wiki Pages to Add

Beyond the templates, consider:

- **Installation Guide** - Step-by-step setup
- **Command Reference** - Complete command list
- **Configuration** - All environment variables
- **Best Practices** - Tips and tricks
- **Changelog** - User-friendly version history
- **Roadmap** - Upcoming features
- **Architecture** - How Praetbot works
- **Database Schema** - Data structure
- **API Guide** - Web interface endpoints

---

**Note**: This file is for maintainer reference. Delete it after setting up the wiki.
