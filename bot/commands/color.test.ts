import { describe, it, expect, vi } from 'vitest';
import color from './color.js';
import { Client, TextChannel } from 'discord.js';

describe('color command', () => {
  it('should return a random hex color', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await color(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toMatch(/🎨 Your random color: \*\*#[0-9a-f]{6}\*\*/);
  });
});
