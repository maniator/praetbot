import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

/**
 * Advanced dice roller with modifier support
 * Supports formats like: 2d20, 3d6+5, 1d100-10
 */
export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User,
  ...args: string[]
): Promise<void> {
  const input = args[0] || '1d6';
  const match = input.match(/(\d+)d(\d+)([+-]\d+)?/);

  if (!match) {
    await channel.send(
      `<@${user.id}> ❌ Format: XdY or XdY+Z (e.g., 2d20+5, 3d6-2)\n` +
        `Examples:\n` +
        `  \`!!dice 2d20\` - Roll 2 twenty-sided dice\n` +
        `  \`!!dice 3d6+5\` - Roll 3 six-sided dice and add 5\n` +
        `  \`!!dice 1d100-10\` - Roll 1 hundred-sided die and subtract 10`
    );
    return;
  }

  const [, numDiceStr, numSidesStr, modifier] = match;
  const numDice = parseInt(numDiceStr);
  const numSides = parseInt(numSidesStr);
  const mod = modifier ? parseInt(modifier) : 0;

  // Validation
  if (numDice > 100) {
    await channel.send(`<@${user.id}> ❌ Maximum 100 dice allowed`);
    return;
  }

  if (numDice < 1) {
    await channel.send(`<@${user.id}> ❌ Must roll at least 1 die`);
    return;
  }

  if (numSides > 1000) {
    await channel.send(`<@${user.id}> ❌ Maximum 1000 sides allowed`);
    return;
  }

  if (numSides < 2) {
    await channel.send(`<@${user.id}> ❌ Dice must have at least 2 sides`);
    return;
  }

  // Roll the dice
  const rolls = Array.from({ length: numDice }, () => Math.floor(Math.random() * numSides) + 1);

  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + mod;

  // Format output
  let result = `<@${user.id}> 🎲 ${numDice}d${numSides}`;
  if (mod !== 0) {
    result += ` ${mod > 0 ? '+' : ''}${mod}`;
  }
  result += `\n**Rolls**: [${rolls.join(', ')}]`;
  result += `\n**Sum**: ${sum}`;
  if (mod !== 0) {
    result += ` ${mod > 0 ? '+' : ''}${mod} = **${total}**`;
  } else {
    result += ` = **${total}**`;
  }

  await channel.send(result);
}
