import { Message } from './message';
import { Command } from './command-interface';
import { commands } from './commands';
import { connect } from '../bin/dbConnect';

class CommandListener {
    private commandRegex : RegExp = /^\!\!([a-zA-Z]*)\s?(.*)?/;
    private addCommandRegex : RegExp = /^\!\!addCommand ([a-zA-Z]*)\s?(.*)?/;
    private removeCommandRegex : RegExp = /^\!\!removeCommand ([a-zA-Z]*)?/;
    private listCommandRegex : RegExp = /^\!\!listCommands/;

    constructor (private botListener : any) { }

    listen () {
        this.botListener.bot.on('message', (message : Message) => {
            const { botId } = this.botListener;

            // don't let the bot recurse
            if (message.user === botId) {
                return;
            }

            if (this.addCommandRegex.test(message.text)) {
                const [, command, response] = message.text.match(this.addCommandRegex);

                connect((db : any) => {
                    db.collection('commands').save({
                        _id: command,
                        value: `(function (bot, channel, user, ...args) { ${response} });`,
                    }).then((err: any, value : any) => {
                        this.botListener.bot.postMessage(message.channel, `<@${message.user}> ${command} added!`, { as_user: true });
                        db.close();
                    });
                });
            } else if (this.removeCommandRegex.test(message.text)) {
                const [, command] = message.text.match(this.removeCommandRegex);

                connect((db : any) => {
                    db.collection('commands').remove({
                        _id: command,
                    }).then((err: any, value : any) => {
                        this.botListener.bot.postMessage(message.channel, `<@${message.user}> ${command} removed!`, { as_user: true });
                        db.close();
                    });
                });
            } else if (this.listCommandRegex.test(message.text)) {
                connect((db : any) => {
                    db.collection('commands').find({}).toArray((error: any, list : Command[] = []) => {
                        const commandList = list.map((item : any) => item._id);

                        commandList.push(...commands.map((_command : Command) => _command.name));

                        this.botListener.bot.postMessage(message.channel, commandList.join(', '), { as_user: true });

                        db.close();
                    });
                });
            } else if (this.commandRegex.test(message.text)) {
                const [, command, args = ''] = message.text.match(this.commandRegex);

                connect((db : any) => {
                    db.collection('commands').find({
                        _id: command
                    }).toArray((error: any, list : Command[] = []) => {
                        this.botListener.bot.getUserById(message.user).then((user : any) => {
                            list.forEach((_command : Command) => {
                                try {
                                    if (_command.value) {
                                        const value = eval(_command.value);
                                        const response = value({
                                            postMessage: this.botListener.bot.postMessage.bind(this.botListener.bot),
                                            botId: this.botListener.botId,
                                            botName: this.botListener.botName,
                                        }, message.channel, user, ...args.split(' '));

                                        if (response) {
                                            this.botListener.bot.postMessage(message.channel, `${response}`, {as_user: true});
                                        }
                                    } else {
                                        console.log('There is no command value for this one', _command);
                                    }
                                } catch (e) {
                                    this.botListener.bot.postMessage(message.channel, `<@${message.user}> there is some issue with that command. \`${e.message}\``, {as_user: true});
                                }
                            });

                            commands.filter((_command : Command) => _command.name === command)
                                .forEach((_command : Command) => {
                                    if (_command.execute) {
                                        _command.execute(this.botListener.bot, message.channel, user, ...args.split(' '));
                                    } else if (_command.respond) {
                                        this.botListener.bot.postMessage(message.channel, `<@${message.user}> ${_command.respond}`, { as_user: true });
                                    }
                                });

                            db.close();
                        });
                    });
                });
            }
        });
    }
}

export { CommandListener };
