import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import indexRouter from './index.js';

describe('Index Router', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.set('view engine', 'hbs');
    app.set('views', './views');
    app.use('/', indexRouter);

    // Mock render to avoid actual view rendering
    vi.spyOn(express.response, 'render').mockImplementation(function (
      this: any,
      view: string,
      options: any
    ) {
      this.status(200).json({ view, options });
      return this;
    });
  });

  it('should render index view on GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      view: 'index',
      options: { title: 'Express' },
    });
  });

  it('should pass correct title to view', async () => {
    const response = await request(app).get('/');

    expect(response.body.options.title).toBe('Express');
  });
});
