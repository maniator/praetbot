import { getCookieByUserId, updateCookie } from './bin/cookies';

var SlackBot = require('slackbots');

require('./bin/www');

// create a bot
const bot = new SlackBot({
  token: process.env.BOT_API_KEY, // Add a bot https://my.slack.com/services/new/bot and put the token
  name: 'Praet Bot'
});

// more information about additional params https://api.slack.com/methods/chat.postMessage
const params = {
  as_user: true
};

const containsAUserRegex : RegExp = /\<\@([a-z0-9]*)\>/i;
const giveUserStars : RegExp = /\<\@([a-z0-9]*)\>\s?\+\+/i;
const takeUserStars : RegExp = /\<\@([a-z0-9]*)\>\s?\-\-/i;

interface Message {
    type: string;
    text: string;
    channel: string;
    user: string;
    group: any;
}

const respondToUserMention = function (text : string, channel : string) {
  if (containsAUserRegex.test(text)) {
    const [, userId] = text.match(containsAUserRegex);

      const promises = [
          getCookieByUserId(userId),
          bot.getUserById(userId)
      ];

      Promise.all(promises).then(([_cookie, user]) => {
          const name = user.name;
          let cookie = _cookie;

          if (giveUserStars.test(text)) {
              if (!cookie) {
                  cookie = {
                      cookies: 0,
                      name,
                      id: userId
                  };
              }

              cookie.cookies++;

              bot.postMessage(channel, `<@${userId}> has ${cookie.cookies} :cookie:'s`, params);
          }

          if (takeUserStars.test(text)) {
              if (!cookie) {
                  cookie = {
                      cookies: 0,
                      name,
                      id: userId
                  };
              }

              cookie.cookies--;

              bot.postMessage(channel, `<@${userId}> has ${cookie.cookies} :cookie:'s`, params);
          }

          console.log(_cookie, userId, cookie);

          const promises = [
              bot.getChannelById(channel),
              updateCookie(cookie),
          ];
          Promise.all(promises).then(function([_channel] : any[]) {
              bot.postMessageToUser(name, `You are being talked about in ${_channel.name ? `<#${channel}>` : 'a private channel'}.`, params);
          });
      });

  }
};

bot.on('start', function() {
  const botId : string = bot.self.id;
  const botName : string = bot.self.name;

  bot.on('message', function ({ type, text, channel, group, user } : Message) {
    if (user === botId) {
      return;
    }

    if (type === 'message') {
      console.log({ type, text, channel, user, group });

      respondToUserMention(text, channel);
    }
  });
});

bot.on('error', function () {
  console.log('error', arguments)
});
