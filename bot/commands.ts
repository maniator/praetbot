import { Command, User } from './command-interface.js';
import { connect } from '../bin/dbConnect.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

// returns whether the command cannot be deleted or not
const isCommandConstant = (commandName: string): boolean => {
  return (
    commands.filter((command: Command) => {
      return commandName === command.name;
    }).length > 0
  );
};

const lookupCommand = function (commandName: string): Promise<Command> {
  return new Promise((res, rej) => {
    let resolved: boolean = false;

    commands
      .filter((_command: Command) => _command.name === commandName)
      .forEach((_command: Command) => {
        resolved = true;
        res(_command);
      });

    if (!resolved) {
      connect(async (db: any) => {
        try {
          const list: Command[] = await db
            .collection('commands')
            .find({
              _id: commandName,
            })
            .toArray();

          if (list.length) {
            resolved = true;
            res(list[0]);
          } else {
            rej(null);
          }
        } finally {
          await db.close();
        }
      });
    }
  });
};

const commands: Command[] = [
  {
    name: 'listCommands',
    async execute(_bot: Client, channel: TextChannel | DMChannel, _user: User): Promise<void> {
      connect(async (db: any) => {
        try {
          const list: Command[] = await db.collection('commands').find({}).toArray();
          const commandList = list.map((item: any) => item._id);

          commandList.push(...commands.map((_command: Command) => _command.name));

          await channel.send(commandList.join(', '));
        } finally {
          await db.close();
        }
      });
    },
  },
  {
    name: 'removeCommand',
    async execute(
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      command: string
    ): Promise<void> {
      if (isCommandConstant(command)) {
        await channel.send(`${command} cannot be changed. Sorry :-(`);
        return;
      }

      connect(async (db: any) => {
        try {
          await db.collection('commands').deleteOne({
            _id: command,
          });
          await channel.send(`<@${user.name}> ${command} removed!`);
        } finally {
          await db.close();
        }
      });
    },
  },
  {
    name: 'addCommand',
    async execute(
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      command: string,
      ...args: any[]
    ): Promise<void> {
      const value = args.length ? args.join(' ') : '';

      if (isCommandConstant(command)) {
        await channel.send(`${command} cannot be changed. Sorry :-(`);
        return;
      }

      connect(async (db: any) => {
        try {
          await db
            .collection('commands')
            .replaceOne({ _id: command }, { _id: command, value }, { upsert: true });
          await channel.send(`<@${user.name}> ${command} added!`);
        } finally {
          await db.close();
        }
      });
    },
    description:
      'Adds a command to the command list `!!addCommand <commandName> <command return function>` \n' +
      'Command has access to the `channel, user <name, id>, ...args`',
  },
  {
    name: 'help',
    async execute(
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      commandName: string
    ): Promise<void> {
      if (!commandName || commandName.length === 0) {
        await channel.send(`<@${user.name}> Please use as follows: \`!!help <commandName>\``);
      } else {
        try {
          const command = await lookupCommand(commandName);
          let explain: string = command.description || '';

          if (!explain) {
            explain = command.value ? '```' + command.value + '```' : 'No current description';
          }

          await channel.send(`<@${user.name}> ${commandName}: ${explain}`);
        } catch {
          await channel.send(`<@${user.name}> That command does not exist`);
        }
      }
    },
  },
  {
    name: 'xkcd',
    async execute(
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      id: string
    ): Promise<void> {
      try {
        const res = await fetch(`http://xkcd.com/${id}/info.0.json`);
        const json = await res.json();
        await channel.send(json.img);
      } catch (error) {
        console.error('Error fetching xkcd:', error);
      }
    },
    description: 'Gets xkcd comic by id `!!xkcd <id>`',
  },
  {
    name: 'weather',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ...args: string[]
    ) => {
      const weatherModule = await import('./commands/weather.js');
      return weatherModule.default(bot, channel, user, ...args);
    },
    description: 'Gets current weather: `!!weather (lat, lon)` or `!!weather city`',
  },
  {
    name: 'roll',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ...args: string[]
    ) => {
      const rollModule = await import('./commands/roll.js');
      return rollModule.default(bot, channel, user, ...args);
    },
    description: 'Gets a random user in the channel.: `!!roll who should buy cookies?`',
  },
];

export { commands };
