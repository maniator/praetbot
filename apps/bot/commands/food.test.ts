import { describe, it, expect, vi } from 'vitest';
import food from './food.js';
import { Client, TextChannel } from 'discord.js';

describe('food command', () => {
  it('should suggest food for given meal', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await food(mockBot, mockChannel, mockUser, 'lunch');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('How about:');
  });

  it('should suggest random food when no meal specified', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await food(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('How about:');
  });
});
