import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

/**
 * Random choice picker
 * Pick randomly from a list of options
 */
export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User,
  ...args: string[]
): Promise<void> {
  const options = args.filter((arg) => arg.trim().length > 0);

  if (options.length === 0) {
    await channel.send(
      `<@${user.id}> 🎭 Provide some options to choose from!\n` +
        `Example: \`!!choose pizza pasta burger\``
    );
    return;
  }

  if (options.length === 1) {
    await channel.send(`<@${user.id}> 🎭 Only one option? I choose: **${options[0]}**`);
    return;
  }

  const choice = options[Math.floor(Math.random() * options.length)];
  await channel.send(`<@${user.id}> 🎭 I choose: **${choice}**`);
}
