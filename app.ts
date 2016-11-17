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

const stars = {};

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

    if (giveUserStars.test(text)) {
      if (!stars[userId]) {
        stars[userId] = 0;
      }

      stars[userId]++;

      bot.postMessage(channel, `<@${userId}> has ${stars[userId]} :cookie:'s`, params);
    }

    if (takeUserStars.test(text)) {
      if (!stars[userId]) {
        stars[userId] = 0;
      }

      stars[userId]--;

      bot.postMessage(channel, `<@${userId}> has ${stars[userId]} :cookie:'s`, params);
    }

    const promises = [
        bot.getUserById(userId),
        bot.getChannelById(channel),
      ];
    Promise.all(promises).then(function([user, _channel] : any[]) {
      bot.postMessageToUser(user.name, `You are being talked about in ${_channel.name ? `<#${channel}>` : 'a private channel'}.`, params);
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