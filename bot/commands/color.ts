import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User
): Promise<void> {
  const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  await channel.send(`<@${user.id}> 🎨 Your random color: **${color}**`);
}
