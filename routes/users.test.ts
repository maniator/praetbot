import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import usersRouter from './users.js';

// Mock the cookies module
vi.mock('../bin/cookies.js', () => ({
  getCookies: vi.fn(),
}));

describe('Users Router', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/users', usersRouter);
  });

  it('should return cookies on GET /users', async () => {
    const { getCookies } = await import('../bin/cookies.js');
    const mockCookies = [
      { id: 'user1', name: 'Alice', cookies: 5 },
      { id: 'user2', name: 'Bob', cookies: 3 },
    ];

    (getCookies as any).mockResolvedValueOnce(mockCookies);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCookies);
    expect(getCookies).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    const { getCookies } = await import('../bin/cookies.js');

    (getCookies as any).mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/users');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch cookies' });
  });

  it('should return empty array when no cookies exist', async () => {
    const { getCookies } = await import('../bin/cookies.js');

    (getCookies as any).mockResolvedValueOnce([]);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
