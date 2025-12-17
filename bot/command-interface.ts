import { Client, TextChannel, DMChannel } from 'discord.js';

interface Command {
  _id?: string;
  name: string;
  description?: string;
  execute?: (
    bot: Client,
    channel: TextChannel | DMChannel,
    user: User,
    ...args: any[]
  ) => Promise<void> | void;
  value?: string;
  respond?: string;
}

interface User {
  name: string;
  id: string;
}

export { Command, User };
