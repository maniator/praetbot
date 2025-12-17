import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User,
  ...args: string[]
): Promise<void> {
  const targetDateStr = args[0];

  if (!targetDateStr) {
    await channel.send(
      `<@${user.id}> ⏱️ Provide a date!\n` +
        `Example: \`!!countdown 2025-12-25\``
    );
    return;
  }

  const targetDate = new Date(targetDateStr);
  const now = new Date();

  if (isNaN(targetDate.getTime())) {
    await channel.send(`<@${user.id}> ❌ Invalid date. Use format: YYYY-MM-DD`);
    return;
  }

  const diff = targetDate.getTime() - now.getTime();

  if (diff < 0) {
    await channel.send(`<@${user.id}> ⏱️ That date has passed!`);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  await channel.send(
    `<@${user.id}> ⏱️ **Time until ${targetDateStr}**\n` +
      `${days} days, ${hours} hours, ${minutes} minutes`
  );
}
