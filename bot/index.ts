import { getCookieByUserId, updateCookie, CookieUser } from '../bin/cookies';
import { Message } from './message';
import { CommandListener } from './command';

var SlackBot = require('slackbots');

interface MessageParams {
    as_user: boolean;
}
class Bot {
    private containsAUserRegex : RegExp = /\<\@([a-z0-9]*)\>/i;
    private giveUserStars : RegExp = /\<\@([a-z0-9]*)\>\s?\+\+/i;
    private takeUserStars : RegExp = /\<\@([a-z0-9]*)\>\s?\-\-/i;
    private bot : any;
    private defaultParams : MessageParams = {
        as_user: true
    };

    private botId : string;
    private botName : string;
    private commandListener : CommandListener;

    constructor (apiKey : string) {
        this.bot = new SlackBot({
          token: apiKey, // Add a bot https://my.slack.com/services/new/bot and put the token
          name: 'The Bot'
        });

        this.commandListener = new CommandListener(this);
    }

    listenToBot () : void {
        this.bot.on('start', () => {
          this.botId = this.bot.self.id;
          this.botName = this.bot.self.name;

          this.listenForMessages();
          this.commandListener.listen();
        });
        this.bot.on('error', function () {
          console.log('error', arguments)
        });
    }

    listenForMessages () : void {
        this.bot.on('message', ({ type, text, channel, group, user } : Message) => {
            if (user === this.botId) {
                return;
            }

            if (type === 'message') {
                console.log({ type, text, channel, user, group });

                this.respondToUserMention(text, channel);
            }
        });
    }

    respondToUserMention (text : string, channel : string) : void {
      if (this.containsAUserRegex.test(text)) {
          const params = this.defaultParams;
        const [, userId] = text.match(this.containsAUserRegex);

          const promises = [
              getCookieByUserId(userId),
              this.bot.getUserById(userId)
          ];

          Promise.all(promises).then(([_cookie, user]) => {
              const name = user.name;
              let cookie = _cookie;

              if (!cookie) {
                  cookie = {
                      cookies: 0,
                      name,
                      id: userId
                  };
              }

              if (this.giveUserStars.test(text)) {
                  cookie.cookies++;

                  this.bot.postMessage(channel, `<@${userId}> has ${cookie.cookies} :cookie:'s`, params);
                  this.tellUserAboutMention(channel, cookie);
              }

              if (this.takeUserStars.test(text)) {
                  cookie.cookies--;

                  this.bot.postMessage(channel, `<@${userId}> has ${cookie.cookies} :cookie:'s`, params);
                  this.tellUserAboutMention(channel, cookie);
              }
          });

      }
    }

    tellUserAboutMention (channel: string, cookie: CookieUser) {
        const params = this.defaultParams;
        const promises = [
            this.bot.getChannelById(channel),
            updateCookie(cookie),
        ];
        Promise.all(promises).then(([_channel] : any[]) => {
            this.bot.postMessageToUser(name, `You are being talked about in ${_channel.name ? `<#${channel}>` : 'a private channel'}.`, params);
        });
    }
}

export { Bot } ;
