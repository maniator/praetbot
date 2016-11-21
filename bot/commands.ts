import { Command } from './command-interface';

const fetch = require('node-fetch');

interface User {
    name: string;
    id: string;
}

const commands : Command[] = [
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
