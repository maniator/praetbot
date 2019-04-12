//loads environment config from .env file rather than require setting system config - ignored in .gitignore
require('dotenv').config();

import { Bot } from './bot/index';

const apiKey : string = process.env.BOT_API_KEY;
const bot = new Bot(apiKey);

bot.listenToBot();
