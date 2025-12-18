import { describe, it, expect, vi } from 'vitest';
import countdown from './countdown.js';
import { Client, TextChannel } from 'discord.js';

describe('countdown command', () => {
  it('should calculate days until future date', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateStr = futureDate.toISOString().split('T')[0];

    await countdown(mockBot, mockChannel, mockUser, dateStr);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('Time until');
    expect(response).toContain('days');
  });

  it('should handle past date', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await countdown(mockBot, mockChannel, mockUser, '2020-01-01');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('That date has passed');
  });

  it('should handle invalid date', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await countdown(mockBot, mockChannel, mockUser, 'invalid');

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('Invalid date');
  });

  it('should require a date argument', async () => {
    const mockBot = {} as Client;
    const mockChannel = {
      send: vi.fn(),
    } as unknown as TextChannel;
    const mockUser = { id: '123', name: 'testuser' };

    await countdown(mockBot, mockChannel, mockUser);

    expect(mockChannel.send).toHaveBeenCalledOnce();
    const response = (mockChannel.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(response).toContain('Provide a date');
  });
});
