import { describe, it, expect, vi } from 'vitest';
import uptime from './uptime.js';
import { Client, TextChannel } from 'discord.js';

describe('uptime command', () => {
  it('should return bot uptime', async () => {
    const mockBot = {
      uptime: 123456789,
    } as unknown as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await uptime(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('⏱️');
    expect(response).toContain('days');
  });

  it('should handle null uptime', async () => {
    const mockBot = {
      uptime: null,
    } as unknown as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await uptime(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('not available');
  });
});
