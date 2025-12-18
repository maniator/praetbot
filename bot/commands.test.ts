import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commands } from './commands';

// Mock the database connection
vi.mock('../bin/dbConnect', () => ({
  connect: vi.fn((callback) => {
    const mockDb = {
      collection: vi.fn((name: string) => ({
        find: vi.fn((query: any) => ({
          toArray: vi.fn(async () => {
            if (Object.keys(query).length === 0) {
              return [
                { _id: 'customCmd1', value: 'return "Hello World"' },
                { _id: 'customCmd2', respond: 'Custom response' },
              ];
            }
            if (query._id === 'customCmd1') {
              return [{ _id: 'customCmd1', value: 'return "Hello World"' }];
            }
            return [];
          }),
        })),
        deleteOne: vi.fn(async () => ({ deletedCount: 1 })),
        replaceOne: vi.fn(async () => ({ acknowledged: true })),
      })),
      close: vi.fn(async () => undefined),
    };
    callback(mockDb);
  }),
}));

// Mock fetch
global.fetch = vi.fn();

const mockSend = vi.fn();
const mockChannel = {
  send: mockSend,
  id: 'channel123',
};

const mockBot = {
  user: { id: 'bot123' },
};

const mockUser = {
  id: 'user123',
  name: 'TestUser',
};

describe('commands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listCommands', () => {
    it('should list all available commands', async () => {
      const listCommand = commands.find((cmd) => cmd.name === 'listCommands');
      expect(listCommand).toBeDefined();

      if (listCommand?.execute) {
        await listCommand.execute(mockBot as any, mockChannel as any, mockUser);
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('customCmd1');
      expect(sentMessage).toContain('customCmd2');
      expect(sentMessage).toContain('listCommands');
    });
  });

  describe('removeCommand', () => {
    it('should remove a custom command', async () => {
      const removeCommand = commands.find((cmd) => cmd.name === 'removeCommand');
      expect(removeCommand).toBeDefined();

      if (removeCommand?.execute) {
        await removeCommand.execute(mockBot as any, mockChannel as any, mockUser, 'customCmd1');
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('removed');
    });

    it('should not remove built-in commands', async () => {
      const removeCommand = commands.find((cmd) => cmd.name === 'removeCommand');
      expect(removeCommand).toBeDefined();

      if (removeCommand?.execute) {
        await removeCommand.execute(mockBot as any, mockChannel as any, mockUser, 'listCommands');
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('cannot be changed');
    });
  });

  describe('addCommand', () => {
    it('should add a new custom command', async () => {
      const addCommand = commands.find((cmd) => cmd.name === 'addCommand');
      expect(addCommand).toBeDefined();

      if (addCommand?.execute) {
        await addCommand.execute(
          mockBot as any,
          mockChannel as any,
          mockUser,
          'myNewCmd',
          'return',
          '"Hello"'
        );
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('added');
    });

    it('should not override built-in commands', async () => {
      const addCommand = commands.find((cmd) => cmd.name === 'addCommand');
      expect(addCommand).toBeDefined();

      if (addCommand?.execute) {
        await addCommand.execute(mockBot as any, mockChannel as any, mockUser, 'help', 'test');
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('cannot be changed');
    });
  });

  describe('help', () => {
    it('should show help for a specific command', async () => {
      const helpCommand = commands.find((cmd) => cmd.name === 'help');
      expect(helpCommand).toBeDefined();

      if (helpCommand?.execute) {
        await helpCommand.execute(mockBot as any, mockChannel as any, mockUser, 'xkcd');
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('xkcd');
    });

    it('should show usage info when no command specified', async () => {
      const helpCommand = commands.find((cmd) => cmd.name === 'help');
      expect(helpCommand).toBeDefined();

      if (helpCommand?.execute) {
        await helpCommand.execute(mockBot as any, mockChannel as any, mockUser, '');
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('Please use as follows');
    });

    it('should handle non-existent commands', async () => {
      const helpCommand = commands.find((cmd) => cmd.name === 'help');
      expect(helpCommand).toBeDefined();

      if (helpCommand?.execute) {
        await helpCommand.execute(mockBot as any, mockChannel as any, mockUser, 'nonexistent');
      }

      expect(mockSend).toHaveBeenCalled();
      const sentMessage = mockSend.mock.calls[0][0];
      expect(sentMessage).toContain('does not exist');
    });
  });

  describe('xkcd', () => {
    it('should fetch and display an xkcd comic', async () => {
      const mockXkcdData = {
        img: 'https://imgs.xkcd.com/comics/test.png',
      };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockXkcdData,
      });

      const xkcdCommand = commands.find((cmd) => cmd.name === 'xkcd');
      expect(xkcdCommand).toBeDefined();

      if (xkcdCommand?.execute) {
        await xkcdCommand.execute(mockBot as any, mockChannel as any, mockUser, '123');
      }

      expect(global.fetch).toHaveBeenCalledWith('http://xkcd.com/123/info.0.json');
      expect(mockSend).toHaveBeenCalledWith('https://imgs.xkcd.com/comics/test.png');
    });

    it('should handle fetch errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const xkcdCommand = commands.find((cmd) => cmd.name === 'xkcd');
      expect(xkcdCommand).toBeDefined();

      if (xkcdCommand?.execute) {
        await xkcdCommand.execute(mockBot as any, mockChannel as any, mockUser, '456');
      }

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('command descriptions', () => {
    it('most commands should have descriptions', () => {
      const commandsWithDescriptions = commands.filter((cmd) => cmd.description);
      // At least some commands should have descriptions
      expect(commandsWithDescriptions.length).toBeGreaterThan(0);

      // Specific commands we know should have descriptions
      const xkcdCommand = commands.find((cmd) => cmd.name === 'xkcd');
      expect(xkcdCommand?.description).toBeDefined();

      const weatherCommand = commands.find((cmd) => cmd.name === 'weather');
      expect(weatherCommand?.description).toBeDefined();

      const rollCommand = commands.find((cmd) => cmd.name === 'roll');
      expect(rollCommand?.description).toBeDefined();
    });
  });
});
