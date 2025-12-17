import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User
): Promise<void> {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  await channel.send(
    `<@${user.id}> ⏱️ **Bot Uptime**\n` +
      `${days}d ${hours}h ${minutes}m ${seconds}s`
  );
}
