import { Command, User } from './command-interface';
import { connect } from '../bin/dbConnect';

const fetch = require('node-fetch');

// returns whether the command cannot be deleted or not
const isCommandConstant = (commandName : string) => {
    return commands.filter((command : Command) => {
        return commandName === command.name;
    }).length > 0;
};

const lookupCommand = function (commandName : string) : Promise<Command> {
    return new Promise((res, rej) => {
        let resolved : boolean = false;

        commands.filter((_command: Command) => _command.name === commandName)
            .forEach((_command : Command) => {
                resolved = true;
                res(_command);
            });

        if (!resolved) {
            connect((db: any) => {
                db.collection('commands').find({
                    _id: commandName
                }).toArray((error: any, list: Command[] = []) => {
                    if (list.length) {
                        resolved = true;
                        res(list[0]);
                    } else {
                        rej(null);
                    }
                    db.close();
                });
            });
        }
    })
};

const commands : Command[] = [
    {
        name: 'listCommands',
        execute (bot: any, channel: any, user : User) : any {
            connect((db: any) => {
                db.collection('commands').find({}).toArray((error: any, list: Command[] = []) => {
                    const commandList = list.map((item: any) => item._id);

                    commandList.push(...commands.map((_command: Command) => _command.name));

                    bot.postMessage(channel.id, commandList.join(', '), {as_user: true});

                    db.close();
                });
            });
        }
    },
    {
        name: 'removeCommand',
        execute (bot: any, channel: any, user : User, command : string) : any {
            if (isCommandConstant(command)) {
                bot.postMessage(channel.id, `${command} cannot be changed. Sorry :-(`, {as_user: true});
                return;
            }

            connect((db: any) => {
                db.collection('commands').remove({
                    _id: command,
                }).then((err: any, value: any) => {
                    bot.postMessage(channel.id, `<@${user.name}> ${command} removed!`, {as_user: true});
                    db.close();
                });
            });
        }
    },
    {
        name: 'addCommand',
        execute (bot: any, channel: any, user : User, command : string, ...args : any[]) : any {
            const value = args.length ? args.join(' ') : '';

            if (isCommandConstant(command)) {
                bot.postMessage(channel.id, `${command} cannot be changed. Sorry :-(`, {as_user: true});
                return;
            }

            connect((db: any) => {
                db.collection('commands').save({
                    _id: command,
                    value,
                }).then((err: any, value: any) => {
                    bot.postMessage(channel.id, `<@${user.name}> ${command} added!`, {as_user: true});
                    db.close();
                });
            });
        },
        description: 'Adds a command to the command list `!!addCommand <commandName> <command return function>` \n'+
            'Command has access to the `channel, user <name, id>, ...args`'
    },
    {
        name: 'help',
        execute (bot: any, channel: any, user : User, commandName : string) : any {
            if (!commandName || commandName.length === 0) {
                bot.postMessage(channel.id, `<@${user.name}> Please use as follows: \`!!help <commandName>\``, { as_user: true });
            } else {
                lookupCommand(commandName).then(function (command: Command) {
                    let explain: string = command.description;

                    if (!explain) {
                        explain = command.value ? '```' + command.value + '```' : 'No current description';
                    }

                    bot.postMessage(channel.id, `<@${user.name}> ${commandName}: ${explain}`, {as_user: true});
                }).catch(function () {
                    bot.postMessage(channel.id, `<@${user.name}> That command does not exist`, {as_user: true});
                });
            }
        }
    },
    {
        name: 'xkcd',
        execute (bot: any, channel: any, user : User, id : number) : any {
            return fetch(`http://xkcd.com/${id}/info.0.json`)
                .then(function(res : any) {
                    return res.json();
                }).then(function(json : any) {
                    bot.postMessage(channel.id, json.img, { as_user: true });
                }).catch(console.log);
        },
        description: 'Gets xkcd comic by id `!!xkcd <id>`'
    },
    {
        name: 'weather',
        execute: require('./commands/weather'),
        description: 'Gets current weather: `!!weather (lan, lon)` or `!!weather city`',
    },
    {
        name: 'roll',
        execute: require('./commands/roll'),
        description: 'Gets a random user in the channel.: `!!roll who should buy cookies?`',
    },
    {
        name: 'sefaria',
        execute: require('./commands/sefaria'),
        description: 'Displays text from Sefaria: `!!sefaria [REF]`\nFor help constructing a valid REF, see: https://github.com/Sefaria/Sefaria-Project/wiki/Text-References',
    },
];

export {
    commands,
};
