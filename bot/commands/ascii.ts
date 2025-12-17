import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

const art = {
  shrug: '¯\\_(ツ)_/¯',
  tableflip: '(╯°□°）╯︵ ┻━┻',
  bear: 'ʕ•ᴥ•ʔ',
  success: '(•̀ᴗ•́)و',
  disapproval: 'ಠ_ಠ',
  party: '٩(◕‿◕｡)۶',
  music: '♪┏(・o･)┛♪',
  love: '(♥_♥)',
  wink: '(◕‿◕)',
  happy: '(◠‿◠)',
};

export default async function (
  _bot: Client,
  channel: TextChannel | DMChannel,
  user: User,
  ...args: string[]
): Promise<void> {
  const type = (args[0] || '').toLowerCase();

  if (!type || !art[type as keyof typeof art]) {
    await channel.send(
      `<@${user.id}> Available ASCII art: ${Object.keys(art).join(', ')}\n` +
        `Example: \`!!ascii shrug\``
    );
    return;
  }

  await channel.send(`<@${user.id}> ${art[type as keyof typeof art]}`);
}
