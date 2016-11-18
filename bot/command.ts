import { Message } from './message';
import { Command } from './command-interface';
import { commands } from './commands';

console.log('Commands', typeof commands, commands);

class CommandListener {
    private commandRegex : RegExp = /^\!\!([a-zA-Z]*) (.*)?/;

    constructor (private bot : any) { }

    listen () {
        this.bot.on('message', (message : Message) => {
            if (this.commandRegex.test(message.text)) {
                const [, command, args] = message.text.match(this.commandRegex);

                commands.filter((_command : Command) => _command.name === command)
                    .forEach((_command : Command) => {
                        if (_command.execute) {
                            _command.execute(this.bot, message.channel, ...args.split(' '));
                        }
                    });
            }
        });
    }
}

export { CommandListener };
