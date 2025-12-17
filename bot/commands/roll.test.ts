import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock discord.js
const mockSend = vi.fn();

const createMockMember = (id: string, username: string, isBot: boolean = false) => ({
    user: {
        id,
        username,
        bot: isBot,
    },
});

const mockChannel = {
    send: mockSend,
    guild: {
        id: 'guild123',
        members: {
            cache: new Map([
                ['user1', createMockMember('user1', 'Alice', false)],
                ['user2', createMockMember('user2', 'Bob', false)],
                ['user3', createMockMember('user3', 'Charlie', false)],
                ['bot1', createMockMember('bot1', 'BotUser', true)],
            ]),
            fetch: vi.fn(async () => undefined),
        },
    },
};

const mockBot = {
    user: { id: 'bot123' },
};

describe('roll command', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should select a random user from the channel', async () => {
        const rollModule = await import('./roll');
        
        await rollModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user123', name: 'TestUser' },
            'buy',
            'cookies'
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('Survey says...');
        expect(sentMessage).toContain('should buy cookies');
        // Should mention one of the users (not the bot)
        expect(sentMessage).toMatch(/<@(user1|user2|user3)>/);
    });

    it('should exclude bots from selection', async () => {
        const rollModule = await import('./roll');
        
        // Run multiple times to ensure bots are never selected
        for (let i = 0; i < 10; i++) {
            mockSend.mockClear();
            
            await rollModule.default(
                mockBot as any,
                mockChannel as any,
                { id: 'user123', name: 'TestUser' },
                'test'
            );

            const sentMessage = mockSend.mock.calls[0][0];
            // Should never mention the bot
            expect(sentMessage).not.toContain('<@bot1>');
        }
    });

    it('should include the action in the response', async () => {
        const rollModule = await import('./roll');
        
        await rollModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user123', name: 'TestUser' },
            'take',
            'out',
            'the',
            'trash'
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('should take out the trash');
    });

    it('should handle channels with no guild', async () => {
        const channelWithoutGuild = {
            send: mockSend,
            guild: null,
        };

        const rollModule = await import('./roll');
        
        await rollModule.default(
            mockBot as any,
            channelWithoutGuild as any,
            { id: 'user123', name: 'TestUser' },
            'test'
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('only works in server channels');
    });

    it('should tag the requesting user in response', async () => {
        const rollModule = await import('./roll');
        
        await rollModule.default(
            mockBot as any,
            mockChannel as any,
            { id: 'user456', name: 'Requester' },
            'do',
            'something'
        );

        expect(mockSend).toHaveBeenCalled();
        const sentMessage = mockSend.mock.calls[0][0];
        expect(sentMessage).toContain('<@user456>');
    });
});
