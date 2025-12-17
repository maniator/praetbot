import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

/**
 * Coin flip command
 * Randomly returns heads or tails
 */
export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User
): Promise<void> {
  const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
  const emoji = result === 'Heads' ? '🪙' : '🪙';

  await channel.send(`<@${user.id}> ${emoji} **${result}!**`);
}
