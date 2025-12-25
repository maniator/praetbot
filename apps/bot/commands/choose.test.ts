import { describe, it, expect, vi } from 'vitest';
import choose from './choose.js';
import { Client, TextChannel } from 'discord.js';

describe('choose command', () => {
  it('should choose from provided options', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await choose(mockBot, mockChannel, mockUser, 'pizza', 'tacos', 'burgers');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('I choose:');
    expect(['pizza', 'tacos', 'burgers'].some((option) => response.includes(option))).toBe(true);
  });

  it('should handle no options provided', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await choose(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('Provide some options');
  });

  it('should handle single option', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await choose(mockBot, mockChannel, mockUser, 'onlyoption');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('onlyoption');
  });
});
