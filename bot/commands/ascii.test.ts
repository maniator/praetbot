import { describe, it, expect, vi } from 'vitest';
import ascii from './ascii.js';
import { Client, TextChannel } from 'discord.js';

describe('ascii command', () => {
  it('should return ASCII art for valid type', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await ascii(mockBot, mockChannel, mockUser, 'shrug');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('¯\\_(ツ)_/¯');
  });

  it('should list available types when no type provided', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await ascii(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('Available ASCII art:');
  });

  it('should handle unknown type', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await ascii(mockBot, mockChannel, mockUser, 'unknown');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('Available ASCII art:');
  });
});
