# Community Commands Collection

A curated collection of custom commands created by the Praetbot community.

> **Want to add your command?** Edit this page or share it in [GitHub Discussions](https://github.com/maniator/praetbot/discussions)!

## Table of Contents

- [Fun & Games](#fun--games)
- [Utility Commands](#utility-commands)
- [Information & Lookup](#information--lookup)
- [Random Generators](#random-generators)
- [Server Management](#server-management)
- [Creative & Social](#creative--social)

---

## Fun & Games

### 🎲 Dice Roller

Roll dice with custom sides.

```javascript
// Usage: !!roll 2d6
const args = arguments[0] || '1d6';
const match = args.match(/(\d+)d(\d+)/);
if (!match) return 'Usage: !!roll XdY (e.g., 2d6)';

const [, num, sides] = match.map(Number);
const rolls = Array.from({ length: num }, () => Math.floor(Math.random() * sides) + 1);
const total = rolls.reduce((a, b) => a + b, 0);

return `🎲 Rolled ${num}d${sides}: [${rolls.join(', ')}] = ${total}`;
```

**Example**: `!!roll 2d20` → 🎲 Rolled 2d20: [15, 8] = 23

---

### 🎱 Magic 8-Ball

Get mystical answers to your questions.

```javascript
const responses = [
  'Yes, definitely! ✨',
  'No way! ❌',
  'Maybe... ask again later 🤔',
  'The stars say yes ⭐',
  'Not looking good... 😬',
  'Absolutely! 💯',
  "Don't count on it 😕",
  'Signs point to yes 👍',
  'Very doubtful 👎',
  'Without a doubt! ✅',
];
return responses[Math.floor(Math.random() * responses.length)];
```

**Example**: `!!8ball Will it rain tomorrow?` → The stars say yes ⭐

---

### 🪙 Coin Flip

Flip a coin, heads or tails.

```javascript
return Math.random() < 0.5 ? 'Heads! 🪙' : 'Tails! 🪙';
```

**Example**: `!!coinflip` → Tails! 🪙

---

### 🎰 Slot Machine

Try your luck!

```javascript
const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

const result = `${slot1} ${slot2} ${slot3}`;
const win = slot1 === slot2 && slot2 === slot3;

return `${result}\n${win ? '🎉 JACKPOT! You win!' : '😔 Try again!'}`;
```

**Example**: `!!slots` → 🍒 🍒 🍒 🎉 JACKPOT! You win!

---

## Utility Commands

### ⏰ Current Time

Show current time in different formats.

```javascript
const now = new Date();
return (
  `🕐 Current time:\n` +
  `Local: ${now.toLocaleString()}\n` +
  `UTC: ${now.toUTCString()}\n` +
  `Unix: ${Math.floor(now.getTime() / 1000)}`
);
```

---

### 🔢 Calculate

Simple calculator.

```javascript
// Usage: !!calc 2 + 2
const expression = Array.from(arguments).join(' ');
try {
  const result = eval(expression);
  return `📊 ${expression} = ${result}`;
} catch (e) {
  return '❌ Invalid expression';
}
```

**⚠️ Warning**: Be careful with `eval()`. Only use in trusted environments.

---

### 📏 Unit Converter

Convert between units.

```javascript
// Usage: !!convert 100 f to c (Fahrenheit to Celsius)
const args = Array.from(arguments).join(' ').toLowerCase();

// Temperature
if (args.includes('f to c')) {
  const f = parseFloat(args);
  const c = (((f - 32) * 5) / 9).toFixed(2);
  return `${f}°F = ${c}°C`;
}
if (args.includes('c to f')) {
  const c = parseFloat(args);
  const f = ((c * 9) / 5 + 32).toFixed(2);
  return `${c}°C = ${f}°F`;
}

// Length
if (args.includes('km to mi')) {
  const km = parseFloat(args);
  const mi = (km * 0.621371).toFixed(2);
  return `${km} km = ${mi} miles`;
}

return 'Supported: f to c, c to f, km to mi, mi to km';
```

---

## Information & Lookup

### 📅 Days Until

Count days until a date.

```javascript
// Usage: !!daysuntil 2025-12-25
const targetDate = new Date(arguments[0]);
const today = new Date();
const diffTime = targetDate - today;
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

return `📅 ${diffDays} days until ${arguments[0]}!`;
```

---

### 🎂 Age Calculator

Calculate age from birthdate.

```javascript
// Usage: !!age 1990-01-15
const birthDate = new Date(arguments[0]);
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();

if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
  age--;
}

return `🎂 Age: ${age} years old`;
```

---

## Random Generators

### 🎭 Random Choice

Pick randomly from options.

```javascript
// Usage: !!choose pizza pasta burger
const options = Array.from(arguments).filter(Boolean);
if (options.length === 0) return 'Provide some options!';

const choice = options[Math.floor(Math.random() * options.length)];
return `🎭 I choose: **${choice}**`;
```

**Example**: `!!choose pizza pasta burger` → 🎭 I choose: **pasta**

---

### 💬 Random Quote

Get a random inspirational quote.

```javascript
const quotes = [
  'The only way to do great work is to love what you do. - Steve Jobs',
  'Innovation distinguishes between a leader and a follower. - Steve Jobs',
  'Stay hungry, stay foolish. - Steve Jobs',
  'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt',
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
];
return '💬 ' + quotes[Math.floor(Math.random() * quotes.length)];
```

---

### 🎨 Random Color

Generate a random hex color.

```javascript
const color =
  '#' +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
return `🎨 Your random color: ${color}`;
```

---

## Server Management

### 📊 Server Time

Show how long bot has been running.

```javascript
const uptime = process.uptime();
const days = Math.floor(uptime / 86400);
const hours = Math.floor((uptime % 86400) / 3600);
const minutes = Math.floor((uptime % 3600) / 60);

return `⏱️ Bot uptime: ${days}d ${hours}h ${minutes}m`;
```

---

### 👥 User Count

Show member count (requires bot access).

```javascript
// This requires Discord.js guild access
// Simple version just returns a message
return '👥 Check server settings for member count';
```

---

## Creative & Social

### 🍕 Food Decider

Can't decide what to eat?

```javascript
const foods = [
  '🍕 Pizza',
  '🍔 Burger',
  '🍝 Pasta',
  '🍜 Ramen',
  '🌮 Tacos',
  '🍣 Sushi',
  '🥗 Salad',
  '🍛 Curry',
  '🍳 Breakfast',
  '🥙 Sandwich',
];
return 'How about: ' + foods[Math.floor(Math.random() * foods.length)];
```

---

### 💪 Workout Generator

Random workout suggestion.

```javascript
const exercises = [
  '20 Push-ups',
  '30 Squats',
  '1-minute Plank',
  '15 Burpees',
  '25 Jumping Jacks',
  '30-second Wall Sit',
  '20 Lunges',
  '15 Mountain Climbers',
];
return '💪 Your workout: ' + exercises[Math.floor(Math.random() * exercises.length)];
```

---

### 🎵 Song Mood

Get a mood-based music suggestion.

```javascript
const moods = {
  happy: ['🎵 Upbeat Pop', '🎸 Feel-Good Rock', '🎹 Happy Piano'],
  sad: ['🎻 Emotional Ballad', '🎹 Sad Piano', '🎸 Slow Rock'],
  energetic: ['🎧 EDM', '🎸 Fast Rock', '🥁 Drum & Bass'],
  chill: ['🎷 Jazz', '🎹 Lo-fi', '🎸 Acoustic'],
};

const mood = arguments[0] || 'chill';
const songs = moods[mood.toLowerCase()] || moods.chill;
return songs[Math.floor(Math.random() * songs.length)];
```

**Example**: `!!songmood happy` → 🎸 Feel-Good Rock

---

## How to Add Commands

To add any of these commands to your Praetbot:

```
!!addCommand commandname [paste code here]
```

Example:

```
!!addCommand coinflip return Math.random() < 0.5 ? 'Heads! 🪙' : 'Tails! 🪙';
```

## Contributing

Found a bug in a command? Have improvements?

1. Edit this wiki page
2. Share in [GitHub Discussions](https://github.com/maniator/praetbot/discussions)
3. Submit to [Awesome Praetbot Commands](Awesome-Praetbot-Commands) for featured commands

---

_Last updated: 2025-12-17 | [Home](Home) | [Awesome Commands](Awesome-Praetbot-Commands)_
