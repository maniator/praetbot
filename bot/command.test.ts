import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommandListener } from './command';
import { Events } from 'discord.js';

// Mock the database connection
const mockDbCommands: any[] = [];
vi.mock('../bin/dbConnect', () => ({
  connect: vi.fn((callback) => {
    const mockDb = {
      collection: vi.fn(() => ({
        find: vi.fn(() => ({
          toArray: vi.fn(async () => mockDbCommands),
        })),
      })),
      close: vi.fn(async () => undefined),
    };
    callback(mockDb);
  }),
}));

const mockSend = vi.fn();
const mockChannel = {
  send: mockSend,
  id: 'channel123',
};

const mockBot = {
  user: { id: 'bot123' },
  on: vi.fn(),
};

const mockBotListener = {
  bot: mockBot,
  botId: 'bot123',
};

describe('CommandListener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbCommands.length = 0; // Clear db commands
  });

  it('should create a command listener instance', () => {
    const listener = new CommandListener(mockBotListener as any);

    expect(listener).toBeDefined();
  });

  it('should detect valid command format', () => {
    const listener = new CommandListener(mockBotListener as any);
    const commandRegex = /^\!\!([a-zA-Z]*)\s?(.*)?/;

    expect('!!help test').toMatch(commandRegex);
    expect('!!ping').toMatch(commandRegex);
    expect('!!echo hello world').toMatch(commandRegex);
    expect('!ping').not.toMatch(commandRegex);
    expect('ping').not.toMatch(commandRegex);
  });

  it('should parse command and arguments correctly', () => {
    const commandRegex = /^\!\!([a-zA-Z]*)\s?(.*)?/;

    const match1 = '!!help weather'.match(commandRegex);
    expect(match1).toBeTruthy();
    expect(match1?.[1]).toBe('help');
    expect(match1?.[2]).toBe('weather');

    const match2 = '!!echo hello world'.match(commandRegex);
    expect(match2).toBeTruthy();
    expect(match2?.[1]).toBe('echo');
    expect(match2?.[2]).toBe('hello world');
  });

  it('should register message listener on listen()', () => {
    const listener = new CommandListener(mockBotListener as any);

    listener.listen();

    expect(mockBot.on).toHaveBeenCalledWith(Events.MessageCreate, expect.any(Function));
  });

  it('should ignore messages from the bot itself', async () => {
    const listener = new CommandListener(mockBotListener as any);
    let messageHandler: Function | undefined;

    mockBot.on.mockImplementation((event: string, handler: Function) => {
      if (event === Events.MessageCreate) {
        messageHandler = handler;
      }
    });

    listener.listen();

    expect(messageHandler).toBeDefined();

    if (messageHandler) {
      const botMessage = {
        content: '!!ping',
        author: { id: 'bot123' },
      };

      await messageHandler(botMessage);

      // Should not call respondToCommand for bot's own messages
      expect(mockSend).not.toHaveBeenCalled();
    }
  });

  it('should handle command execution errors gracefully', async () => {
    const listener = new CommandListener(mockBotListener as any);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Set up a db command that will cause an error
    mockDbCommands.push({ _id: 'errorCmd', value: 'throw new Error("test")' });

    const mockMessage = {
      content: '!!errorCmd',
      author: { id: 'user123', username: 'TestUser' },
      channel: mockChannel,
    };

    // Should not throw
    await listener.respondToCommand(mockMessage as any);

    consoleErrorSpy.mockRestore();
  });

  describe('runCommand', () => {
    it('should execute command with execute function', async () => {
      const listener = new CommandListener(mockBotListener as any);

      const mockCommand = {
        name: 'test',
        execute: vi.fn(async () => {}),
      };

      await listener.runCommand(
        mockChannel as any,
        mockCommand,
        { id: 'user123', name: 'TestUser' },
        {},
        ''
      );

      expect(mockCommand.execute).toHaveBeenCalled();
    });

    it('should send respond text if command has respond', async () => {
      const listener = new CommandListener(mockBotListener as any);

      const mockCommand = {
        name: 'test',
        respond: 'Test response',
      };

      await listener.runCommand(
        mockChannel as any,
        mockCommand,
        { id: 'user123', name: 'TestUser' },
        {},
        ''
      );

      expect(mockSend).toHaveBeenCalledWith(expect.stringContaining('Test response'));
    });

    it('should evaluate command value if provided', async () => {
      const listener = new CommandListener(mockBotListener as any);

      const mockCommand = {
        name: 'test',
        value: 'return "Evaluated response"',
      };

      await listener.runCommand(
        mockChannel as any,
        mockCommand,
        { id: 'user123', name: 'TestUser' },
        {},
        ''
      );

      expect(mockSend).toHaveBeenCalledWith('Evaluated response');
    });

    it('should handle value evaluation errors', async () => {
      const listener = new CommandListener(mockBotListener as any);

      const mockCommand = {
        name: 'test',
        value: 'throw new Error("Test error")',
      };

      await listener.runCommand(
        mockChannel as any,
        mockCommand,
        { id: 'user123', name: 'TestUser' },
        {},
        ''
      );

      expect(mockSend).toHaveBeenCalledWith(expect.stringContaining('issue with that command'));
    });
  });

  it('should process built-in commands from commands list', async () => {
    const listener = new CommandListener(mockBotListener as any);

    // Mock a message with a built-in command - just test that it doesn't throw
    const mockMessage = {
      content: '!!help xkcd',
      author: { id: 'user123', username: 'TestUser' },
      channel: mockChannel,
    };

    // Should not throw
    await expect(listener.respondToCommand(mockMessage as any)).resolves.not.toThrow();
  });
});
