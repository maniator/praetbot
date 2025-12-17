import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

const responses = [
  'Yes, definitely! ✨',
  'No way! ❌',
  'Maybe... ask again later 🤔',
  'The stars say yes ⭐',
  'Not looking good... 😬',
  'Absolutely! 💯',
  "Don't count on it 😕",
  'Signs point to yes 👍',
  'Very doubtful 👎',
  'Without a doubt! ✅',
  'My sources say no 📚',
  'Outlook good 🌟',
  'Cannot predict now 🔮',
  'Reply hazy, try again 💭',
  'Better not tell you now 🤐',
  'It is certain ✔️',
  'Most likely 👌',
  'Outlook not so good 😟',
  'Yes 😊',
  'Concentrate and ask again 🧘',
];

/**
 * Magic 8-Ball command
 * Ask a yes/no question and get a mystical answer
 */
export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User,
  ...args: string[]
): Promise<void> {
  const question = args.join(' ');

  if (!question) {
    await channel.send(`<@${user.id}> 🎱 Ask me a yes/no question!\nExample: \`!!8ball Will it rain tomorrow?\``);
    return;
  }

  // Add a small delay for effect
  await channel.sendTyping();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const answer = responses[Math.floor(Math.random() * responses.length)];

  await channel.send(`<@${user.id}> 🎱 **Question**: ${question}\n**Answer**: ${answer}`);
}
