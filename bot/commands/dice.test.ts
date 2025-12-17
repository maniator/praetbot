import { describe, it, expect, vi } from 'vitest';
import dice from './dice.js';
import { Client, TextChannel } from 'discord.js';

describe('dice command', () => {
  it('should roll dice with standard notation', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await dice(mockBot, mockChannel, mockUser, '2d6');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('🎲');
    expect(response).toContain('Rolling 2d6');
  });

  it('should handle dice with modifiers', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await dice(mockBot, mockChannel, mockUser, '1d20+5');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('🎲');
    expect(response).toContain('+5');
  });

  it('should default to 1d6 when no args', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await dice(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('🎲');
    expect(response).toContain('Rolling 1d6');
  });

  it('should handle invalid dice notation', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await dice(mockBot, mockChannel, mockUser, 'invalid');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('Invalid dice notation');
  });
});
