import { getCookieByUserId, updateCookie, CookieUser } from '@praetbot/shared-lib/cookies';
import { CommandListener } from './command.js';
import { Client, GatewayIntentBits, Events, TextChannel, DMChannel } from 'discord.js';

class Bot {
  private containsAUserRegex: RegExp = /<@(\d+)>/i;
  private giveUserStars: RegExp = /<@(\d+)>\s?\+\+/i;
  private takeUserStars: RegExp = /<@(\d+)>\s?--/i;
  public bot: Client;

  public botId: string = '';
  private botName: string = '';
  private commandListener: CommandListener;

  constructor(token: string) {
    this.bot = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
      ],
    });

    this.bot.login(token).catch(console.error);
    this.commandListener = new CommandListener(this);
  }

  listenToBot(): void {
    this.bot.once(Events.ClientReady, (client) => {
      this.botId = client.user.id;
      this.botName = client.user.username;
      console.log(`Logged in as ${this.botName}!`);

      this.listenForMessages();
      this.commandListener.listen();
    });

    this.bot.on('error', (error) => {
      console.log('error', error);
    });
  }

  listenForMessages(): void {
    this.bot.on(Events.MessageCreate, async (message) => {
      if (message.author.id === this.botId) {
        return;
      }

      if (message.content) {
        await this.respondToUserMention(message.content, message.channelId);
      }
    });
  }

  async respondToUserMention(text: string, channelId: string): Promise<void> {
    if (this.containsAUserRegex.test(text)) {
      const match = text.match(this.containsAUserRegex);
      if (!match) {
        return;
      }

      const userId = match[1];

      try {
        const cookie = await getCookieByUserId(userId);
        const user = await this.bot.users.fetch(userId);
        const name = user.username;

        const updatedCookie: CookieUser = cookie || {
          cookies: 0,
          name,
          id: userId,
        };

        const channel = await this.bot.channels.fetch(channelId);

        if (this.giveUserStars.test(text)) {
          updatedCookie.cookies = (updatedCookie.cookies || 0) + 1;

          if (channel && (channel instanceof TextChannel || channel instanceof DMChannel)) {
            await channel.send(`<@${userId}> has ${updatedCookie.cookies} :cookie:'s`);
          }
          await this.tellUserAboutMention(channelId, updatedCookie);
        }

        if (this.takeUserStars.test(text)) {
          updatedCookie.cookies = (updatedCookie.cookies || 0) - 1;

          if (channel && (channel instanceof TextChannel || channel instanceof DMChannel)) {
            await channel.send(`<@${userId}> has ${updatedCookie.cookies} :cookie:'s`);
          }
          await this.tellUserAboutMention(channelId, updatedCookie);
        }
      } catch (error) {
        console.error('Error in respondToUserMention:', error);
      }
    }
  }

  async tellUserAboutMention(channelId: string, cookie: CookieUser): Promise<void> {
    try {
      const channel = await this.bot.channels.fetch(channelId);
      await updateCookie(cookie);

      const user = await this.bot.users.fetch(cookie.id);
      const channelName = channel && 'name' in channel ? channel.name : null;

      await user.send(
        `You are being talked about in ${channelName ? `#${channelName}` : 'a private channel'}.`
      );
    } catch (error) {
      console.error('Error in tellUserAboutMention:', error);
    }
  }
}

export { Bot };
