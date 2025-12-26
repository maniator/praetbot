import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

const quotes = [
  'The only way to do great work is to love what you do. - Steve Jobs',
  'Innovation distinguishes between a leader and a follower. - Steve Jobs',
  'Stay hungry, stay foolish. - Steve Jobs',
  'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt',
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  'Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill',
  'The only impossible journey is the one you never begin. - Tony Robbins',
];

export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User
): Promise<void> {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  await channel.send(`<@${user.id}> 💬 ${quote}`);
}
