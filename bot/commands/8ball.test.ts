import { describe, it, expect, vi } from 'vitest';
import eightBall from './8ball.js';
import { Client, TextChannel } from 'discord.js';

describe('8ball command', () => {
  it('should return a magic 8-ball response', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
      sendTyping: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await eightBall(mockBot, mockChannel, mockUser, 'will', 'it', 'rain?');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('🎱');
  });

  it('should work without a question', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
      sendTyping: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await eightBall(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('🎱');
  });
});
