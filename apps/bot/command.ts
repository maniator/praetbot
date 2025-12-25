import { Message as DiscordMessage, Events, TextChannel, DMChannel } from 'discord.js';
import { Command, User } from './command-interface.js';
import { commands } from './commands.js';
import { connect } from '../../packages/shared-lib/dbConnect';
import { Bot } from './index.js';
import { CommandRegistry } from './types.js';
import { Db } from 'mongodb';
import { executeSandboxedCode } from './sandbox.js';

class CommandListener {
  private commandRegex: RegExp = /^\!\!([a-zA-Z]*)\s?(.*)?/;

  constructor(private botListener: Bot) {}

  async runCommand(
    channel: TextChannel | DMChannel,
    command: Command,
    user: User,
    _commandNames: CommandRegistry,
    args: string = ''
  ): Promise<void> {
    if (command.execute) {
      await command.execute(this.botListener.bot, channel, user, ...args.split(' '));
    } else if (command.respond) {
      await channel.send(`<@${user.id}> ${command.respond}`);
    } else if (command.value) {
      try {
        // Execute custom command in secure sandbox
        const context = {
          user: {
            id: user.id,
            name: user.name,
          },
          args: args.split(' '),
          channel: {
            id: channel.id,
          },
        };

        const response = executeSandboxedCode(
          `return (function(user, args, channel) { ${command.value} })(user, args, channel);`,
          context
        );

        if (response) {
          await channel.send(`${response}`);
        }
      } catch (e) {
        const error = e as Error;
        await channel.send(
          `<@${user.id}> there is some issue with that command. \`${error.message}\``
        );
      }
    }
  }

  async respondToCommand(message: DiscordMessage): Promise<void> {
    const match = message.content.match(this.commandRegex);
    if (!match) {
      return;
    }

    const [, command, args = ''] = match;

    connect(async (db: Db) => {
      try {
        const commandList = (await db
          .collection('commands')
          .find({})
          .toArray()) as unknown as Command[];
        const list = commandList.filter((c: Command) => c._id === command);

        const user: User = {
          id: message.author.id,
          name: message.author.username,
        };

        const channel = message.channel;
        if (!(channel instanceof TextChannel || channel instanceof DMChannel)) {
          return;
        }

        const commandNames: CommandRegistry = {};
        commandList.forEach((c: Command) => {
          commandNames[c._id || ''] = {
            name: c._id || '',
            run: this.runCommand.bind(this, channel, c, user, commandNames),
          };
        });

        commands.forEach((c: Command) => {
          commandNames[c.name] = {
            name: c.name,
            run: async (cmdArgs?: string) => {
              await this.runCommand(channel, c, user, commandNames, cmdArgs || '');
              return '';
            },
          };
        });

        for (const _command of list) {
          await this.runCommand(channel, _command, user, commandNames, args);
        }

        const matchingCommands = commands.filter((_command: Command) => _command.name === command);
        for (const _command of matchingCommands) {
          await this.runCommand(channel, _command, user, commandNames, args);
        }
      } catch (error) {
        console.error('Error in respondToCommand:', error);
      }
    });
  }

  listen(): void {
    this.botListener.bot.on(Events.MessageCreate, async (message: DiscordMessage) => {
      const { botId } = this.botListener;

      // don't let the bot recurse
      if (message.author.id === botId) {
        return;
      }

      if (this.commandRegex.test(message.content)) {
        await this.respondToCommand(message);
      }
    });
  }
}

export { CommandListener };
