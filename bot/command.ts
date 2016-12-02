import {Message} from './message';
import {Command, User} from './command-interface';
import {commands} from './commands';
import {connect} from '../bin/dbConnect';

class CommandListener {
    private commandRegex: RegExp = /^\!\!([a-zA-Z]*)\s?(.*)?/;

    constructor(private botListener: any) { }

    runCommand (bot : any, command: Command, channel : any, user : User, commandNames : any, args : string = '') {
        if (command.execute) {
            command.execute(bot, channel, user, ...args.split(' '));
        } else if (command.respond) {
            bot.postMessage(channel.id, `<@${user.id}> ${command.respond}`, {as_user: true});
        } else if (command.value) {
            try {
                const value = new Function('bot', 'channel', 'user', 'commands', 'process', '...args', command.value);
                const response = value({
                    postMessage: bot.postMessage.bind(bot),
                }, channel, user, commandNames, null, ...args.split(' '));

                if (response) {
                    return bot.postMessage(channel.id, `${response}`, {as_user: true});
                }
            } catch (e) {
                return bot.postMessage(channel.id, `<@${user.id}> there is some issue with that command. \`${e.message}\``, {as_user: true});
            }
        }
    }

    respondToCommand (message: Message) {
        connect((db: any) => {
            const [, command, args = ''] = message.text.match(this.commandRegex);

            db.collection('commands').find({}).toArray((error: any, commandList: Command[] = []) => {
                const list = commandList.filter((c: Command) => c._id === command);
                const promises = [
                    this.botListener.bot.getUserById(message.user),
                    this.botListener.bot.getChannelById(message.channel),
                    this.botListener.bot.getGroupById(message.channel),
                ];
                Promise.all(promises).then(([user, _channel, group] : any) => {
                    const channel = _channel.id ? _channel : group;
                    const commandNames : any = {};
                    commandList.forEach((c: Command) => {
                        commandNames[c._id] = {
                            name: c._id,
                            run: this.runCommand.bind(this, {
                                postMessage (_ : string, message : string) {
                                    return message;
                                }
                            }, c, channel, user, commandNames),
                        }
                    });
                    commands.forEach((c: Command) => {
                        commandNames[c.name] = {
                            name: c.name,
                            run: (args : string) => {
                                // these commands are usually async
                                this.runCommand(this.botListener.bot, c, channel, user, commandNames, args);
                                return '';
                            },
                        }
                    });

                    list.forEach((_command: Command) => this.runCommand(this.botListener.bot, _command, channel, user, commandNames, args));

                    commands.filter((_command: Command) => _command.name === command)
                        .forEach((_command: Command) => this.runCommand(this.botListener.bot, _command, channel, user, commandNames, args));

                    db.close();
                });
            });
        });
    }

    listen() {
        this.botListener.bot.on('message', (message: Message) => {
            const {botId} = this.botListener;

            // don't let the bot recurse
            if (message.user === botId) {
                return;
            }


            if (this.commandRegex.test(message.text)) {
                this.respondToCommand(message);
            }
        });
    }
}

export {CommandListener};
