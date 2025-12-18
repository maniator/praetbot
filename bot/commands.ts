import { Command, User } from './command-interface.js';
import { connect } from '../bin/dbConnect.js';
import { Client, TextChannel, DMChannel } from 'discord.js';
import { Db } from 'mongodb';
import { StoredCommand } from './types.js';

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
      connect(async (db: Db) => {
        try {
          const list: StoredCommand[] = await db
            .collection<StoredCommand>('commands')
            .find({
              _id: commandName,
            })
            .toArray();

          if (list.length) {
            resolved = true;
            res(list[0] as Command);
          } else {
            rej(null);
          }
        } catch (error) {
          console.error('Error looking up command:', error);
          rej(error);
        }
      });
    }
  });
};

const commands: Command[] = [
  {
    name: 'listCommands',
    async execute(_bot: Client, channel: TextChannel | DMChannel, _user: User): Promise<void> {
      connect(async (db: Db) => {
        try {
          const list: StoredCommand[] = await db
            .collection<StoredCommand>('commands')
            .find({})
            .toArray();
          const commandList = list.map((item: StoredCommand) => item._id);

          commandList.push(...commands.map((_command: Command) => _command.name));

          await channel.send(commandList.join(', '));
        } catch (error) {
          console.error('Error listing commands:', error);
        }
      });
    },
  },
  {
    name: 'removeCommand',
    async execute(
      _bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      command: string
    ): Promise<void> {
      if (isCommandConstant(command)) {
        await channel.send(`${command} cannot be changed. Sorry :-(`);
        return;
      }

      connect(async (db: Db) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await db.collection('commands').deleteOne({ _id: command } as any);
          await channel.send(`<@${user.name}> ${command} removed!`);
        } catch (error) {
          console.error('Error removing command:', error);
        }
      });
    },
  },
  {
    name: 'addCommand',
    async execute(
      _bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      command: string,
      ...args: string[]
    ): Promise<void> {
      const value = args.length ? args.join(' ') : '';

      if (isCommandConstant(command)) {
        await channel.send(`${command} cannot be changed. Sorry :-(`);
        return;
      }

      connect(async (db: Db) => {
        try {
          await db
            .collection('commands')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .replaceOne({ _id: command } as any, { _id: command, value }, { upsert: true });
          await channel.send(`<@${user.name}> ${command} added!`);
        } catch (error) {
          console.error('Error adding command:', error);
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
      _bot: Client,
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
      _bot: Client,
      channel: TextChannel | DMChannel,
      _user: User,
      id: string
    ): Promise<void> {
      try {
        const res = await fetch(`http://xkcd.com/${id}/info.0.json`);
        const json = (await res.json()) as { img: string };
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
  {
    name: 'dice',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ...args: string[]
    ) => {
      const diceModule = await import('./commands/dice.js');
      return diceModule.default(bot, channel, user, ...args);
    },
    description: 'Roll dice with modifiers: `!!dice 2d20+5` or `!!dice 1d6`',
  },
  {
    name: '8ball',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ...args: string[]
    ) => {
      const eightBallModule = await import('./commands/8ball.js');
      return eightBallModule.default(bot, channel, user, ...args);
    },
    description: 'Ask the magic 8-ball: `!!8ball will it rain tomorrow?`',
  },
  {
    name: 'coinflip',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ..._args: string[]
    ) => {
      const coinflipModule = await import('./commands/coinflip.js');
      return coinflipModule.default(bot, channel, user);
    },
    description: 'Flip a coin: `!!coinflip`',
  },
  {
    name: 'choose',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ...args: string[]
    ) => {
      const chooseModule = await import('./commands/choose.js');
      return chooseModule.default(bot, channel, user, ...args);
    },
    description: 'Choose randomly from options: `!!choose pizza tacos burgers`',
  },
  {
    name: 'quote',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ..._args: string[]
    ) => {
      const quoteModule = await import('./commands/quote.js');
      return quoteModule.default(bot, channel, user);
    },
    description: 'Get a motivational quote: `!!quote`',
  },
  {
    name: 'color',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ..._args: string[]
    ) => {
      const colorModule = await import('./commands/color.js');
      return colorModule.default(bot, channel, user);
    },
    description: 'Generate a random color: `!!color`',
  },
  {
    name: 'food',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ..._args: string[]
    ) => {
      const foodModule = await import('./commands/food.js');
      return foodModule.default(bot, channel, user);
    },
    description: 'Get food suggestions: `!!food lunch` or `!!food dinner`',
  },
  {
    name: 'uptime',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ..._args: string[]
    ) => {
      const uptimeModule = await import('./commands/uptime.js');
      return uptimeModule.default(bot, channel, user);
    },
    description: 'Check bot uptime: `!!uptime`',
  },
  {
    name: 'ascii',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ...args: string[]
    ) => {
      const asciiModule = await import('./commands/ascii.js');
      return asciiModule.default(bot, channel, user, ...args);
    },
    description: 'Get ASCII art: `!!ascii heart` or `!!ascii cat`',
  },
  {
    name: 'countdown',
    execute: async (
      bot: Client,
      channel: TextChannel | DMChannel,
      user: User,
      ...args: string[]
    ) => {
      const countdownModule = await import('./commands/countdown.js');
      return countdownModule.default(bot, channel, user, ...args);
    },
    description: 'Countdown to date: `!!countdown 2024-12-25` (YYYY-MM-DD)',
  },
];

export { commands };
