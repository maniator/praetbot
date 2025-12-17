import { describe, it, expect, vi } from 'vitest';
import quote from './quote.js';
import { Client, TextChannel } from 'discord.js';

describe('quote command', () => {
  it('should return a motivational quote', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await quote(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('💬');
  });
});
