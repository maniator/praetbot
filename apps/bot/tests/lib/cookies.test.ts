import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateCookie, getCookieByUserId, getCookies, type CookieUser } from '../../../../packages/shared-lib/cookies';

// Mock the database connection used by lib/cookies BEFORE importing the module under test
vi.mock('../../lib/dbConnect.js', () => ({
  connect: vi.fn((callback) => {
    const mockDb = {
      collection: vi.fn((_name: string) => ({
        find: vi.fn((query: unknown) => ({
          toArray: vi.fn(async () => {
            const q = query as Record<string, unknown>;
            if (q.id === 'user123') {
              return [{ id: 'user123', name: 'TestUser', cookies: 5 }];
            }
            if (Object.keys(q).length === 0) {
              return [
                { id: 'user1', name: 'User1', cookies: 3 },
                { id: 'user2', name: 'User2', cookies: 7 },
              ];
            }
            return [];
          }),
        })),
        insertOne: vi.fn(async (_doc: unknown) => ({ acknowledged: true })),
        updateOne: vi.fn(async (_query: unknown, _update: unknown) => ({ acknowledged: true })),
      })),
    };
    callback(mockDb as unknown as { collection: (name: string) => unknown });
  }),
}));

describe('cookies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCookieByUserId', () => {
    it('should return a cookie user when found', async () => {
      const result = await getCookieByUserId('user123');

      expect(result).toBeDefined();
      expect(result?.id).toBe('user123');
      expect(result?.name).toBe('TestUser');
      expect(result?.cookies).toBe(5);
    });

    it('should return null when user not found', async () => {
      const result = await getCookieByUserId('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getCookies', () => {
    it('should return all cookie users', async () => {
      const result = await getCookies();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('updateCookie', () => {
    it('should update an existing cookie user', async () => {
      const cookieUser: CookieUser = {
        id: 'user123',
        name: 'TestUser',
        cookies: 10,
      };

      const result = await updateCookie(cookieUser);

      expect(result).toBeDefined();
      expect(result.id).toBe('user123');
      expect(result.cookies).toBe(10);
    });

    it('should create a new cookie user if not exists', async () => {
      const cookieUser: CookieUser = {
        id: 'newuser',
        name: 'NewUser',
        cookies: 1,
      };

      const result = await updateCookie(cookieUser);

      expect(result).toBeDefined();
      expect(result.id).toBe('newuser');
    });
  });
});
