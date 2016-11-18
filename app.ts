import { Bot } from './bot/index';

require('./bin/www');

const apiKey : string = process.env.BOT_API_KEY;
const bot = new Bot(apiKey);

bot.listenToBot();
