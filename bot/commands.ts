import { Command } from './command-interface';
import { connect } from '../bin/dbConnect';

const fetch = require('node-fetch');

interface User {
    name: string;
    id: string;
}

// returns whether the command cannot be deleted or not
const isCommandConstant = (commandName : string) => {
    return commands.filter((command : Command) => {
        return commandName === command.name;
    }).length > 0;
};

const commands : Command[] = [
    {
        name: 'listCommands',
        execute (bot: any, channel: string, user : User) : any {
            connect((db: any) => {
                db.collection('commands').find({}).toArray((error: any, list: Command[] = []) => {
                    const commandList = list.map((item: any) => item._id);

                    commandList.push(...commands.map((_command: Command) => _command.name));

                    bot.postMessage(channel, commandList.join(', '), {as_user: true});

                    db.close();
                });
            });
        }
    },
    {
        name: 'removeCommand',
        execute (bot: any, channel: string, user : User, command : string) : any {
            if (isCommandConstant(command)) {
                bot.postMessage(channel, `${command} cannot be changed. Sorry :-(`, {as_user: true});
                return;
            }

            connect((db: any) => {
                db.collection('commands').remove({
                    _id: command,
                }).then((err: any, value: any) => {
                    bot.postMessage(channel, `<@${user.name}> ${command} removed!`, {as_user: true});
                    db.close();
                });
            });
        }
    },
    {
        name: 'addCommand',
        execute (bot: any, channel: string, user : User, command : string, ...args : any[]) : any {
            const value = args.length ? args.join(' ') : '';

            if (isCommandConstant(command)) {
                bot.postMessage(channel, `${command} cannot be changed. Sorry :-(`, {as_user: true});
                return;
            }

            connect((db: any) => {
                db.collection('commands').save({
                    _id: command,
                    value,
                }).then((err: any, value: any) => {
                    bot.postMessage(channel, `<@${user.name}> ${command} added!`, {as_user: true});
                    db.close();
                });
            });
        }
    },
    {
        name: 'xkcd',
        execute (bot: any, channel: string, user : User, id : number) : any {
            return fetch(`http://xkcd.com/${id}/info.0.json`)
                .then(function(res : any) {
                    return res.json();
                }).then(function(json : any) {
                    bot.postMessage(channel, json.img, { as_user: true });
                }).catch(console.log);
        }
    },
];

export {
    commands,
};
