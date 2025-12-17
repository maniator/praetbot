import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

const foods = [
  '🍕 Pizza',
  '🍔 Burger',
  '🍝 Pasta',
  '🍜 Ramen',
  '🌮 Tacos',
  '🍣 Sushi',
  '🥗 Salad',
  '🍛 Curry',
  '🍳 Breakfast',
  '🥙 Sandwich',
  '🍲 Soup',
  '🥘 Paella',
  '🍱 Bento',
];

export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User
): Promise<void> {
  const food = foods[Math.floor(Math.random() * foods.length)];
  await channel.send(`<@${user.id}> How about: **${food}**`);
}
