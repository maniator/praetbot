import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock discord.js
const mockSend = vi.fn();
const mockChannel = {
    send: mockSend,
    guild: { id: 'guild123' },
};

const mockBot = {
    user: { id: 'bot123' },
};

// Mock fetch
global.fetch = vi.fn();

describe('weather command', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.WEATHER_KEY = 'test-api-key';
    });

    it('should fetch weather by city', async () => {
        const mockWeatherData = {
            main: {
                temp: 293.15, // 20°C
            },
            weather: [
                {
                    description: 'clear sky',
                },
            ],
        };

        (global.fetch as any).mockResolvedValueOnce({
            json: async () => mockWeatherData,
        });

        const weatherModule = await import('./weather');
        
        await weatherModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user123', name: 'TestUser' },
            'London'
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('68.0F');
        expect(sentMessage).toContain('20.0C');
        expect(sentMessage).toContain('clear sky');
    });

    it('should fetch weather by coordinates', async () => {
        const mockWeatherData = {
            main: {
                temp: 283.15, // 10°C
            },
            weather: [
                {
                    description: 'light rain',
                },
            ],
        };

        (global.fetch as any).mockResolvedValueOnce({
            json: async () => mockWeatherData,
        });

        const weatherModule = await import('./weather');
        
        await weatherModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user123', name: 'TestUser' },
            '(51.5074,',
            '-0.1278)'
        );

        expect(mockSend).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
        const mockErrorData = {
            message: 'city not found',
        };

        (global.fetch as any).mockResolvedValueOnce({
            json: async () => mockErrorData,
        });

        const weatherModule = await import('./weather');
        
        await weatherModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user123', name: 'TestUser' },
            'InvalidCity12345'
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('couldn\'t get the data');
    });

    it('should validate latitude bounds', async () => {
        const weatherModule = await import('./weather');
        
        await weatherModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user123', name: 'TestUser' },
            '(999,',
            '0)'
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('Latitude must be between');
    });

    it('should show help message when no arguments provided', async () => {
        const weatherModule = await import('./weather');
        
        await weatherModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user123', name: 'TestUser' }
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('help weather');
    });
});
