# Awesome Praetbot Commands ⭐

A curated list of the best, most creative, and most useful custom commands for Praetbot.

> ⭐ **Featured**: Commands that are particularly well-designed, useful, or creative

## Table of Contents

- [⭐ Featured Commands](#-featured-commands)
- [🎮 Games](#-games)
- [🛠️ Utilities](#️-utilities)
- [🎉 Fun](#-fun)
- [📊 Statistics](#-statistics)
- [🤖 Advanced](#-advanced)

---

## ⭐ Featured Commands

### 🎲 Advanced Dice Roller

The most comprehensive dice roller with modifiers.

```javascript
// Usage: !!dice 2d20+5 or !!dice 3d6-2
const input = arguments[0] || '1d6';
const match = input.match(/(\d+)d(\d+)([+-]\d+)?/);

if (!match) return '❌ Format: XdY or XdY+Z (e.g., 2d20+5)';

const [, numDice, numSides, modifier] = match;
const dice = parseInt(numDice);
const sides = parseInt(numSides);
const mod = modifier ? parseInt(modifier) : 0;

if (dice > 100) return '❌ Maximum 100 dice';
if (sides > 1000) return '❌ Maximum 1000 sides';

const rolls = Array.from({ length: dice }, () => 
  Math.floor(Math.random() * sides) + 1
);
const sum = rolls.reduce((a, b) => a + b, 0);
const total = sum + mod;

let result = `🎲 ${dice}d${sides}`;
if (mod !== 0) result += ` ${mod > 0 ? '+' : ''}${mod}`;
result += `\nRolls: [${rolls.join(', ')}]`;
result += `\nSum: ${sum}`;
if (mod !== 0) result += ` ${mod > 0 ? '+' : ''}${mod} = ${total}`;
else result += ` = ${total}`;

return result;
```

**Why it's awesome**: Handles modifiers, shows all rolls, validates input, supports D&D-style notation.

---

### 📝 Quick Poll

Create a quick yes/no poll with results tracking.

```javascript
// Usage: !!poll Should we order pizza?
const question = Array.from(arguments).join(' ');
if (!question) return '❌ Usage: !!poll <question>';

// In a real implementation, this would track responses
// For now, it's a template
return `📊 **Poll**: ${question}\nReact with 👍 for Yes or 👎 for No!`;
```

**Why it's awesome**: Simple, effective, uses Discord's built-in reactions.

---

### 🌟 Random Team Generator

Randomly split users into teams.

```javascript
// Usage: !!teams Alice Bob Charlie David
const players = Array.from(arguments);
if (players.length < 2) return '❌ Need at least 2 players!';

// Shuffle array
for (let i = players.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [players[i], players[j]] = [players[j], players[i]];
}

const mid = Math.ceil(players.length / 2);
const team1 = players.slice(0, mid);
const team2 = players.slice(mid);

return `🔵 **Team 1**: ${team1.join(', ')}\n` +
       `🔴 **Team 2**: ${team2.join(', ')}`;
```

**Why it's awesome**: Perfect for games, fair randomization, clean output.

---

## 🎮 Games

### 🎯 Number Guessing Game

Guess a number between 1-100.

```javascript
// This is a simplified version
// Full version would track guesses per user
const target = Math.floor(Math.random() * 100) + 1;
const guess = parseInt(arguments[0]);

if (isNaN(guess)) return '🎯 Guess a number between 1-100!';
if (guess < target) return '⬆️ Higher!';
if (guess > target) return '⬇️ Lower!';
return `🎉 Correct! The number was ${target}!`;
```

---

### 🃏 Blackjack

Simple blackjack card draw.

```javascript
const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['♠️', '♥️', '♦️', '♣️'];

const draw = () => {
  const card = cards[Math.floor(Math.random() * cards.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return `${card}${suit}`;
};

return `🎴 You drew: ${draw()} and ${draw()}`;
```

---

## 🛠️ Utilities

### 📋 Character Counter

Count characters, words, and lines.

```javascript
const text = Array.from(arguments).join(' ');
if (!text) return '❌ Provide text to count';

const chars = text.length;
const words = text.trim().split(/\s+/).length;
const lines = text.split('\n').length;

return `📋 **Text Stats**\n` +
       `Characters: ${chars}\n` +
       `Words: ${words}\n` +
       `Lines: ${lines}`;
```

---

### 🔐 Password Generator

Generate secure random passwords.

```javascript
const length = parseInt(arguments[0]) || 16;
if (length < 8) return '❌ Minimum 8 characters';
if (length > 64) return '❌ Maximum 64 characters';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
let password = '';

for (let i = 0; i < length; i++) {
  password += chars.charAt(Math.floor(Math.random() * chars.length));
}

return `🔐 Generated password (${length} chars):\n\`${password}\`\n⚠️ Delete this message after copying!`;
```

---

### ⏱️ Countdown

Show time remaining until a specific time.

```javascript
// Usage: !!countdown 2025-12-25 (Christmas)
const targetDate = new Date(arguments[0]);
const now = new Date();

if (isNaN(targetDate.getTime())) {
  return '❌ Invalid date. Use format: YYYY-MM-DD';
}

const diff = targetDate - now;
if (diff < 0) return '⏱️ That date has passed!';

const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

return `⏱️ **Time until ${arguments[0]}**\n` +
       `${days} days, ${hours} hours, ${minutes} minutes`;
```

---

## 🎉 Fun

### 🎭 Character Generator

Generate random character descriptions for D&D or stories.

```javascript
const races = ['Human', 'Elf', 'Dwarf', 'Orc', 'Halfling', 'Gnome'];
const classes = ['Warrior', 'Mage', 'Rogue', 'Cleric', 'Ranger', 'Bard'];
const traits = ['Brave', 'Cunning', 'Wise', 'Strong', 'Quick', 'Charming'];
const flaws = ['Greedy', 'Reckless', 'Stubborn', 'Naive', 'Arrogant', 'Fearful'];

const race = races[Math.floor(Math.random() * races.length)];
const cls = classes[Math.floor(Math.random() * classes.length)];
const trait = traits[Math.floor(Math.random() * traits.length)];
const flaw = flaws[Math.floor(Math.random() * flaws.length)];

return `🎭 **Random Character**\n` +
       `Race: ${race}\n` +
       `Class: ${cls}\n` +
       `Trait: ${trait}\n` +
       `Flaw: ${flaw}`;
```

---

### 🎨 ASCII Art Generator

Generate simple ASCII art.

```javascript
const type = (arguments[0] || 'shrug').toLowerCase();

const art = {
  shrug: '¯\\_(ツ)_/¯',
  tableflip: '(╯°□°）╯︵ ┻━┻',
  bear: 'ʕ•ᴥ•ʔ',
  heart: '❤️',
  star: '⭐',
  success: '(•̀ᴗ•́)و',
  disapproval: 'ಠ_ಠ',
  party: '٩(◕‿◕｡)۶',
  music: '♪┏(・o･)┛♪'
};

return art[type] || `Available: ${Object.keys(art).join(', ')}`;
```

**Example**: `!!ascii shrug` → ¯\\_(ツ)_/¯

---

## 📊 Statistics

### 📈 Word Frequency

Count word frequency in text.

```javascript
const text = Array.from(arguments).join(' ').toLowerCase();
if (!text) return '❌ Provide text to analyze';

const words = text.match(/\b\w+\b/g) || [];
const freq = {};

words.forEach(word => {
  freq[word] = (freq[word] || 0) + 1;
});

const sorted = Object.entries(freq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

let result = '📈 **Top 5 Words**\n';
sorted.forEach(([word, count]) => {
  result += `${word}: ${count}\n`;
});

return result;
```

---

## 🤖 Advanced

### 🧮 Expression Evaluator

Safe(r) math expression evaluator.

```javascript
const expr = Array.from(arguments).join(' ');
if (!expr) return '❌ Provide a math expression';

// Whitelist allowed characters
if (!/^[\d\s+\-*/.()]+$/.test(expr)) {
  return '❌ Only numbers and operators allowed: + - * / ( )';
}

try {
  const result = eval(expr);
  return `🧮 ${expr} = ${result}`;
} catch (e) {
  return '❌ Invalid expression';
}
```

⚠️ **Security Note**: This uses `eval()` with input sanitization. Still use with caution!

---

### 📅 Date Formatter

Format dates in multiple formats.

```javascript
const dateStr = arguments[0];
if (!dateStr) return '❌ Provide a date (YYYY-MM-DD)';

const date = new Date(dateStr);
if (isNaN(date.getTime())) return '❌ Invalid date';

return `📅 **Date Formats**\n` +
       `Full: ${date.toDateString()}\n` +
       `ISO: ${date.toISOString().split('T')[0]}\n` +
       `Locale: ${date.toLocaleDateString()}\n` +
       `Unix: ${Math.floor(date.getTime() / 1000)}`;
```

---

## 💡 Tips for Creating Great Commands

1. **Validate Input**: Always check if arguments are valid
2. **Show Examples**: Include usage examples in your code comments
3. **Handle Errors**: Use try-catch for operations that might fail
4. **Limit Ranges**: Prevent abuse (max 100 dice, max 64 char passwords, etc.)
5. **Clear Output**: Use emojis and formatting for readable results
6. **Document**: Add comments explaining what your command does

## Contributing to Awesome Commands

To get your command featured here:

1. It must be well-tested and working
2. It should be useful or creative
3. It must have good error handling
4. It should be well-documented

Submit in [GitHub Discussions](https://github.com/maniator/praetbot/discussions) with:
- Command name and code
- Usage examples
- Why it's awesome!

---

_Last updated: 2025-12-17 | [Home](Home) | [Community Commands](Community-Commands)_
