import { Bot } from './bot/index.js';

const apiKey: string = process.env.BOT_API_KEY || '';

if (!apiKey) {
  console.error('BOT_API_KEY environment variable is required');
  process.exit(1);
}

const bot = new Bot(apiKey);

bot.listenToBot();

export { bot };
