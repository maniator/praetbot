import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connect } from './dbConnect';
import { MongoClient } from 'mongodb';

// Mock MongoClient from mongodb
vi.mock('mongodb', () => {
  class MockMongoClient {
    async connect(): Promise<void> {
      return undefined;
    }
    db(): { collection: () => unknown } {
      return {
        collection: () => ({}),
      };
    }
  }

  return {
    MongoClient: MockMongoClient,
  };
});

describe('dbConnect', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = { ...process.env };
    process.env.MONGO_USER = 'testuser';
    process.env.MONGO_PASSWORD = 'testpass';
    process.env.MONGO_SERVER = 'localhost:27017/testdb';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should connect to MongoDB and call callback', async () => {
    const mockCallback = vi.fn();

    await connect(mockCallback);

    expect(mockCallback).toHaveBeenCalled();
  });

  it('should handle connection errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const connectSpy = vi
      .spyOn(MongoClient.prototype, 'connect')
      .mockRejectedValueOnce(new Error('Connection failed'));

    try {
      await connect(vi.fn());
    } catch (_error) {
      // Error is expected
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    connectSpy.mockRestore();
  });
});
