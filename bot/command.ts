import {Message} from './message';
import {Command} from './command-interface';
import {commands} from './commands';
import {connect} from '../bin/dbConnect';

class CommandListener {
    private commandRegex: RegExp = /^\!\!([a-zA-Z]*)\s?(.*)?/;

    constructor(private botListener: any) { }

    respondToCommand (message: Message) {
        connect((db: any) => {
            const [, command, args = ''] = message.text.match(this.commandRegex);

            db.collection('commands').find({
                _id: command
            }).toArray((error: any, list: Command[] = []) => {
                const promises = [
                    this.botListener.bot.getUserById(message.user),
                    this.botListener.bot.getChannelById(message.channel),
                ];
                Promise.all(promises).then(([user, channel] : any) => {
                    list.forEach((_command: Command) => {
                        try {
                            if (_command.value) {
                                const value = new Function('bot', 'channel', 'user', '...args', _command.value);
                                const response = value({
                                    postMessage: this.botListener.bot.postMessage.bind(this.botListener.bot),
                                    botId: this.botListener.botId,
                                    botName: this.botListener.botName,
                                }, channel, user, ...args.split(' '));

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

                    commands.filter((_command: Command) => _command.name === command)
                        .forEach((_command: Command) => {
                            if (_command.execute) {
                                _command.execute(this.botListener.bot, channel, user, ...args.split(' '));
                            } else if (_command.respond) {
                                this.botListener.bot.postMessage(message.channel, `<@${message.user}> ${_command.respond}`, {as_user: true});
                            }
                        });

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
