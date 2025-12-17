# Migration from Other Bots

**Category**: Q&A

## Migrating to Praetbot from another Discord bot?

If you're switching from another bot to Praetbot, this is the place to share your experience and get help!

## Popular Bots to Migrate From

Are you coming from:

- 👍 **MEE6**
- ❤️ **Dyno**
- 🎉 **Carl-bot**
- 🚀 **Tatsu**
- ⚡ **Mudae**
- 💚 **Dank Memer**
- 🎮 **Other** (comment which one!)

## Common Migration Scenarios

### 1. Cookie/Points System Migration

**From MEE6 levels/XP:**
- Export your MEE6 data (if possible)
- Convert to cookie format
- Import to Praetbot database

**From other points systems:**
- Map old points to cookies
- Preserve user rankings
- Import custom commands

### 2. Custom Commands Migration

**Most bots allow custom commands:**

```markdown
**Old bot command**: !customcmd
**Praetbot equivalent**: !!addCommand customcmd return "response"
```

Share your command conversions!

### 3. Features You Miss

What features from your old bot do you wish Praetbot had?

This helps us prioritize development!

## Migration Guides

### From MEE6

**What transfers:**
- ✅ Custom commands (manual recreation)
- ✅ User points (as cookies, manual)
- ❌ Levels (not yet supported)
- ❌ Role rewards (not yet supported)
- ❌ Moderation logs (not available)

**Steps:**
1. Document your MEE6 commands
2. Recreate them in Praetbot with `!!addCommand`
3. If you need levels, open a feature request!

### From Dyno

**What transfers:**
- ✅ Custom commands
- ✅ Auto-responses (via custom commands)
- ❌ Moderation features
- ❌ Auto-mod
- ❌ Music features

**Steps:**
1. List your Dyno custom commands
2. Convert to Praetbot format
3. Set up similar functionality

### From Carl-bot

**What transfers:**
- ✅ Custom commands
- ✅ Fun commands (recreate)
- ❌ Reaction roles
- ❌ Logging
- ❌ Polls (can be added!)

### From Custom Bots

**If you built your own bot:**

Share your experience switching! What did you:
- Keep running alongside Praetbot?
- Successfully migrate?
- Have to give up?

## Migration Templates

### Command Conversion Template

```markdown
### Command: oldcommand

**Old bot**: [Bot name]
**Old syntax**: !oldcommand args
**Old response**: [What it did]

**Praetbot conversion**:
```javascript
!!addCommand oldcommand [your code here]
```

**Notes**: [Any differences or limitations]
```

### User Data Migration Template

```markdown
### Data: [Type of data]

**Source**: [Old bot name]
**Format**: [CSV/JSON/Database]
**Size**: [Number of records]
**Fields**: [What data it contains]

**Migration approach**:
1. Export from old bot
2. Transform data
3. Import to Praetbot

**Script/tool used**: [Link if available]

**Success rate**: X%

**Issues encountered**: [Any problems]
```

## Help Needed

### I'm Stuck!

If you need help migrating:

1. **Describe your situation:**
   - What bot are you coming from?
   - What features do you need?
   - What's not working?

2. **Share your data format:**
   - How is it structured?
   - Can you export it?
   - What's the volume?

3. **What you've tried:**
   - Steps taken so far
   - Where you're blocked
   - Error messages

Community members or maintainers will help!

## Migration Tools

### Wanted: Migration Scripts

We could use community-contributed scripts for:

- MEE6 data export/import
- Dyno command conversion
- Carl-bot command migration
- Generic CSV importer
- Database migration tools

**Can you build one?** Share it here!

### Example Migration Script

```javascript
// Example: Convert MEE6 export to Praetbot cookies
const fs = require('fs');

const mee6Data = JSON.parse(fs.readFileSync('mee6-export.json'));
const praetbotCookies = mee6Data.users.map(user => ({
  id: user.id,
  name: user.username,
  cookies: Math.floor(user.xp / 100) // Convert XP to cookies
}));

fs.writeFileSync('praetbot-import.json', JSON.stringify(praetbotCookies));
```

Share your scripts!

## Why Switch to Praetbot?

What made you choose Praetbot?

- ⭐ Open source
- 🎨 Customizable
- 💰 Free to run
- 🔒 Self-hosted (privacy)
- 🛠️ Easy to modify
- 🎓 Learning opportunity
- 📊 Own your data
- 🚀 Other reasons?

## What You'll Miss

Be honest! What features from your old bot can't Praetbot match?

This helps us understand what to prioritize:

**Common gaps:**
- Advanced moderation
- Music playback
- Reaction roles
- Leveling system
- Economy system
- Mini-games
- Logging features

**Vote on priorities** to help us build what the community needs!

## Migration Success Stories

### Template

```markdown
## Migrated from: [Old Bot]

**Server size**: X members
**Migration time**: Y hours/days
**Difficulty**: Easy/Medium/Hard

**What worked well**:
- Point 1
- Point 2

**Challenges**:
- Challenge 1
- Challenge 2

**What I miss from old bot**:
- Feature 1
- Feature 2

**What's better in Praetbot**:
- Better thing 1
- Better thing 2

**Overall experience**: [Would you recommend?]

**Advice for others**: 
[Your tips]
```

## Dual-Bot Setup

Running Praetbot alongside another bot?

**Common setups:**
- Praetbot for custom commands + MEE6 for leveling
- Praetbot for fun + Dyno for moderation
- Multiple bots for different features

**Share your setup!**

## Resources

- [Praetbot Documentation](https://github.com/maniator/praetbot/blob/main/README.md)
- [Custom Commands Guide](https://github.com/maniator/praetbot/blob/main/WEB_INTERFACE.md)
- [Feature Requests](https://github.com/maniator/praetbot/discussions) - Request missing features
- [Community Commands](#) - Find recreated commands

## Need a Feature from Your Old Bot?

Open a feature request! Include:
- What bot had it
- How it worked
- Why you need it
- How you'd use it in your server

The community might build it!

---

**Share your migration story below! 🔄**

Help others make the switch successfully! 💪
