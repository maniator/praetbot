//Inspired by
//http://venturebeat.com/2016/11/07/how-our-dumb-bot-attracted-1-million-users-without-even-trying/

import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

async function rollCommand(_bot: Client, channel: TextChannel, args: string): Promise<string> {
  try {
    // Get guild members from the channel
    const guild = channel.guild;
    if (!guild) {
      return 'This command only works in server channels.';
    }

    // Fetch all members
    await guild.members.fetch();
    const members = Array.from(guild.members.cache.values());

    // Filter out bots
    const humanMembers = members.filter((member) => !member.user.bot);

    if (humanMembers.length === 0) {
      return 'No users found in this server.';
    }

    const randomIndex = Math.floor(Math.random() * humanMembers.length);
    const randomMember = humanMembers[randomIndex];

    return `Survey says... <@${randomMember.user.id}> should ${args}`;
  } catch (error) {
    console.error('Error in rollCommand:', error);
    return 'Sorry, I encountered an error trying to pick a random user.';
  }
}

export default async function (
  bot: Client,
  channel: TextChannel | DMChannel,
  user: User,
  ...args: string[]
): Promise<void> {
  // Check if it's a text channel (has guild)
  if (channel.type !== 0) {
    await channel.send('This command only works in server text channels.');
    return;
  }
  
  try {
    const response = await rollCommand(bot, channel as TextChannel, args.join(' '));
    await channel.send(`<@${user.id}> ${response}`);
  } catch (error) {
    await channel.send(`<@${user.id}> Error: ${error}`);
  }
}
