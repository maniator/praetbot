# GitHub Discussions Setup

This file contains instructions for setting up GitHub Discussions and creating the frontend framework discussion.

## Enable GitHub Discussions

1. Go to your repository on GitHub
2. Click **Settings** (requires admin access)
3. Scroll down to **Features** section
4. Check the box for **Discussions**
5. Click **Set up discussions**

## Create the Frontend Framework Discussion

Once Discussions are enabled:

1. Go to the **Discussions** tab in your repository
2. Click **New discussion**
3. Select category: **Ideas** (or create this category if it doesn't exist)
4. Title: `Frontend Framework Discussion - What should we use for the web interface?`
5. Copy the content from `.github/DISCUSSION_TEMPLATES/frontend-framework.md`
6. Paste into the discussion body
7. Click **Start discussion**

## Recommended Discussion Categories

Set up these categories in Settings > Discussions:

1. **💡 Ideas** - For proposals and suggestions (use for frontend framework discussion)
2. **🙏 Q&A** - For questions and answers
3. **🎉 Show and Tell** - For sharing projects and designs
4. **📣 Announcements** - For project updates
5. **💬 General** - For general discussion

## Pin the Frontend Discussion

After creating the discussion:

1. Open the frontend framework discussion
2. Click the **⋯** menu (three dots)
3. Select **Pin discussion**
4. This will keep it at the top of the Discussions page

## Update Documentation

After creating the discussion, update these files with the actual URL:

### In `README.md`

Replace:

```markdown
- Share your thoughts in [GitHub Discussions](https://github.com/maniator/praetbot/discussions)
```

With:

```markdown
- Share your thoughts in [GitHub Discussions](https://github.com/maniator/praetbot/discussions/1)
```

(Use the actual discussion number)

### In `docs/SCREENSHOTS.md`

Replace:

```markdown
- [GitHub Discussions](https://github.com/maniator/praetbot/discussions)
- Open an issue with tag `frontend` or `design`
```

With:

```markdown
- [Frontend Framework Discussion](https://github.com/maniator/praetbot/discussions/1)
- Open an issue with tag `frontend` or `design`
```

### In `docs/screenshots/README.md`

Replace:

```markdown
- Open a [GitHub Discussion](https://github.com/maniator/praetbot/discussions)
- Comment on [Issue #XX](https://github.com/maniator/praetbot/issues) (Frontend Framework Discussion)
```

With:

```markdown
- Join the [Frontend Framework Discussion](https://github.com/maniator/praetbot/discussions/1)
```

## Create Labels for Related Issues

Go to Issues > Labels and create:

- `frontend` - Frontend/UI related
- `design` - Design and UX
- `help wanted` - Good for contributors
- `good first issue` - Good for new contributors

## Example Discussion Topics

After the frontend framework discussion, consider creating:

1. **Cookie Leaderboard Design** - Share mockups and wireframes
2. **Feature Requests** - What features should the web interface have?
3. **Deployment Stories** - Share how you deployed Praetbot
4. **Custom Commands Showcase** - Share your coolest custom commands

## Monitoring Discussions

- Check discussions regularly for feedback
- Respond to questions and suggestions
- Update the frontend discussion with vote tallies weekly
- After 2-3 weeks, tally votes and announce the decision

## Making the Decision

After gathering community input:

1. Tally the votes (reactions on each option)
2. Consider the comments and reasoning
3. Factor in maintainability and contributor availability
4. Post a decision summary in the discussion
5. Pin the decision comment
6. Close the discussion or mark it as answered
7. Create a new issue or project board to start implementation

---

**Note**: This file is for maintainer reference and won't be visible to end users. It can be deleted after Discussions are set up.
