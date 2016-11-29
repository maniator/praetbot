//Inspired by
//http://venturebeat.com/2016/11/07/how-our-dumb-bot-attracted-1-million-users-without-even-trying/

import { User } from '../command-interface';

function rollCommand(bot: any, channel: any, args : string) : Promise<string> {
    
    //Get channel users
    const randomIndex = Math.floor(Math.random() * channel.members.length);
    const randomUserId = channel.members[randomIndex]; //TODO: more random
    const userInfo = bot.getUserById(randomUserId);
    
    //Insert witty response.
    return userInfo.then((user : any) => `Survey says... <@${user.name}> should ${args}`);
}

module.exports = function (bot: any, channel: any, user: User, ...args : any[]) {
    rollCommand(bot, channel, args.join(' ')).then(function (response) {
        bot.postMessage(channel.id, `@${user.name} ${response}`, { as_user: true });
    }).catch(function (error) {
        bot.postMessage(channel.id, `@${user.name} ${error}`, { as_user: true });
    });
};