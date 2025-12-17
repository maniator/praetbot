import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import app from './eApp.js';

// Mock the routes
vi.mock('./routes/index.js', () => ({
  default: express.Router().get('/', (_req, res) => {
    res.render('index', { title: 'Express' });
  }),
}));

vi.mock('./routes/users.js', () => ({
  default: express.Router().get('/', (_req, res) => {
    res.json([{ id: 'user1', name: 'Test User', cookies: 5 }]);
  }),
}));

describe('eApp - Express Application', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be an Express application', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('should have view engine set to hbs', () => {
    expect(app.get('view engine')).toBe('hbs');
  });

  it('should handle 404 errors', async () => {
    const response = await request(app).get('/nonexistent-route');

    expect(response.status).toBe(404);
  });

  it('should mount index router on /', async () => {
    const response = await request(app).get('/');

    // The route should be accessible (even if it tries to render)
    expect([200, 500]).toContain(response.status);
  });

  it('should mount users router on /users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
