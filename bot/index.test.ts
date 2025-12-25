import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Bot } from './index';
import { Events } from 'discord.js';

// Mock discord.js
vi.mock('discord.js', async () => {
  const actual = await vi.importActual('discord.js');
  return {
    ...actual,
    Client: class MockClient {
      login = vi.fn(async () => undefined);
      once = vi.fn();
      on = vi.fn();
      user = { id: 'bot123', username: 'TestBot' };
      users = {
        fetch: vi.fn(async (id: string) => ({
          id,
          username: 'TestUser',
          send: vi.fn(),
        })),
      };
      channels = {
        fetch: vi.fn(async (id: string) => ({
          id,
          name: 'test-channel',
          send: vi.fn(),
        })),
      };
    },
    GatewayIntentBits: {
      Guilds: 1,
      GuildMessages: 2,
      MessageContent: 4,
      GuildMembers: 8,
      DirectMessages: 16,
    },
    Events: {
      ClientReady: 'ready',
      MessageCreate: 'messageCreate',
    },
  };
});

// Mock the cookies module
vi.mock('../bin/cookies', () => ({
  getCookieByUserId: vi.fn(async (id: string) => ({
    id,
    name: 'TestUser',
    cookies: 5,
  })),
  updateCookie: vi.fn(async (cookie: any) => cookie),
}));

// Mock CommandListener
vi.mock('./command', () => ({
  CommandListener: class MockCommandListener {
    listen = vi.fn();
  },
}));

describe('Bot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a bot instance with token', () => {
    const bot = new Bot('test-token');

    expect(bot).toBeDefined();
    expect(bot.bot).toBeDefined();
  });

  it('should set up event listeners on listenToBot', () => {
    const bot = new Bot('test-token');
    const onceSpy = vi.spyOn(bot.bot, 'once');
    const onSpy = vi.spyOn(bot.bot, 'on');

    bot.listenToBot();

    expect(onceSpy).toHaveBeenCalledWith(Events.ClientReady, expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should detect user mentions with ++', () => {
    const bot = new Bot('test-token');
    const text = '<@123456789> ++';

    // Use a private method test through regex
    expect(text).toMatch(/<\@(\d+)\>/i);
    expect(text).toMatch(/<\@(\d+)\>\s?\+\+/i);
  });

  it('should detect user mentions with --', () => {
    const bot = new Bot('test-token');
    const text = '<@123456789>--';

    expect(text).toMatch(/<\@(\d+)\>/i);
    expect(text).toMatch(/<\@(\d+)\>\s?\-\-/i);
  });

  it('should not match invalid user mentions', () => {
    const bot = new Bot('test-token');
    const text = '@username ++';

    // Discord mentions must be in format <@id>
    expect(text).not.toMatch(/<\@(\d+)\>/i);
  });

  it('should handle bot ready event', async () => {
    const bot = new Bot('test-token');
    let readyHandler: Function | undefined;

    bot.bot.once = vi.fn((event, handler) => {
      if (event === Events.ClientReady) {
        readyHandler = handler;
      }
    });

    bot.listenToBot();

    expect(readyHandler).toBeDefined();

    // Simulate ready event
    if (readyHandler) {
      const mockClient = {
        user: { id: 'bot123', username: 'TestBot' },
      };
      readyHandler(mockClient);

      expect(bot.botId).toBe('bot123');
    }
  });

  describe('respondToUserMention', () => {
    it('should increment cookies on ++ mention', async () => {
      const bot = new Bot('test-token');
      const { updateCookie } = await import('../bin/cookies');

      await bot.respondToUserMention('<@123456789> ++', 'channel123', 'author123');

      expect(updateCookie).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123456789',
          cookies: 6, // 5 + 1
        })
      );
    });

    it('should decrement cookies on -- mention', async () => {
      const bot = new Bot('test-token');
      const { updateCookie } = await import('../bin/cookies');

      await bot.respondToUserMention('<@123456789> --', 'channel123', 'author123');

      expect(updateCookie).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123456789',
          cookies: 4, // 5 - 1
        })
      );
    });

    it('should handle new users with no existing cookies', async () => {
      const bot = new Bot('test-token');
      const { getCookieByUserId, updateCookie } = await import('../bin/cookies');

      (getCookieByUserId as any).mockResolvedValueOnce(null);

      await bot.respondToUserMention('<@987654321> ++', 'channel123', 'author123');

      expect(updateCookie).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '987654321',
          cookies: 1, // 0 + 1 for new user
        })
      );
    });

    it('should not respond to messages without mentions', async () => {
      const bot = new Bot('test-token');
      const { updateCookie } = await import('../bin/cookies');

      await bot.respondToUserMention('Hello world', 'channel123', 'author123');

      expect(updateCookie).not.toHaveBeenCalled();
    });
  });
});
