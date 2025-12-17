# Share Your Custom Commands

**Category**: Show and Tell

## Show off your creative Praetbot commands!

One of the coolest features of Praetbot is the ability to create custom commands with `!!addCommand`. We'd love to see what you've built!

## How to Share

Post your custom commands in the comments below with:

1. **Command name** - What you call it
2. **Command code** - The JavaScript function
3. **What it does** - Brief description
4. **Example usage** - How to use it in Discord
5. **Screenshot** (optional) - Show it in action!

## Template

```markdown
### Command: `!!mycommand`

**Description**: Brief description of what it does

**Code**:
```javascript
return "Hello from my custom command!";
```

**Usage**: `!!mycommand arguments`

**Example Output**:
> Hello from my custom command!

**Screenshot**: (optional)
```

## Example Custom Commands

### 1. Coin Flip

**Description**: Flips a coin and returns heads or tails

**Code**:
```javascript
return Math.random() < 0.5 ? 'Heads! 🪙' : 'Tails! 🪙';
```

**Usage**: `!!coinflip`

**Example Output**:
> Heads! 🪙

---

### 2. 8Ball

**Description**: Magic 8-ball responses to your questions

**Code**:
```javascript
const responses = [
  'Yes, definitely!',
  'No way!',
  'Maybe... ask again later',
  'The stars say yes ✨',
  'Not looking good...',
  'Absolutely!',
  'Don\'t count on it'
];
return responses[Math.floor(Math.random() * responses.length)];
```

**Usage**: `!!8ball Will I win the lottery?`

**Example Output**:
> Yes, definitely!

---

### 3. Motivational Quote

**Description**: Returns a random motivational quote

**Code**:
```javascript
const quotes = [
  'Believe you can and you\'re halfway there. - Theodore Roosevelt',
  'The only way to do great work is to love what you do. - Steve Jobs',
  'Don\'t watch the clock; do what it does. Keep going. - Sam Levenson'
];
return quotes[Math.floor(Math.random() * quotes.length)];
```

**Usage**: `!!motivate`

---

## Ideas for Custom Commands

Need inspiration? Try creating:

- 🎲 **Dice roller** - Roll dice with custom sides
- 🎰 **Random picker** - Choose between options
- 📊 **Poll creator** - Quick polls
- 🎮 **Game stats** - Track scores or stats
- 📅 **Reminders** - Simple reminder system
- 🔢 **Calculator** - Math operations
- 🎨 **ASCII art** - Fun text art
- 🌍 **Translation** - Quick translations
- 📝 **Note taker** - Save quick notes
- 🎵 **Song requests** - Track music requests
- 🍕 **Food picker** - Decide what to eat
- 💪 **Workout tracker** - Log exercises
- 🎯 **Daily challenge** - Random daily tasks

## Advanced Examples

Got something complex? Share it! We want to see:

- Commands that use external APIs
- Commands that interact with the database
- Multi-step commands
- Commands with user input validation
- Utility commands for server management

## Tips for Great Commands

- Keep them simple and focused
- Add error handling
- Include helpful output messages
- Use emojis for visual appeal
- Document your command with `!!help commandname`

## Contributing Your Commands

If you create something amazing, consider:

1. Adding it to the built-in commands (submit a PR!)
2. Creating a wiki page with command collections
3. Starting a `praetbot-commands` repository

## Community Collections

Looking for more commands? Check out:

- [Community Commands Wiki](#) (coming soon)
- [Awesome Praetbot Commands](#) (coming soon)

---

**Share your commands below and inspire others! 🚀**
