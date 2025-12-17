import { describe, it, expect, vi } from 'vitest';
import coinflip from './coinflip.js';
import { Client, TextChannel } from 'discord.js';

describe('coinflip command', () => {
  it('should return heads or tails', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await coinflip(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toMatch(/🪙 \*\*(Heads|Tails)!\*\*/);
  });
});
