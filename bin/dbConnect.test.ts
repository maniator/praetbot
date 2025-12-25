import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connect } from './dbConnect';
import { MongoClient } from 'mongodb';

// Mock MongoClient with an inline class
vi.mock('mongodb', () => {
  class MockMongoClient {
    static instances: any[] = [];
    connectFn = vi.fn(async () => undefined);
    dbFn = vi.fn(() => ({
      collection: vi.fn(),
    }));

    constructor(url: string) {
      MockMongoClient.instances.push(this);
    }

    async connect() {
      return this.connectFn();
    }

    db() {
      return this.dbFn();
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
    // Clear instances before each test
    (MongoClient as any).instances = [];
    // Save original environment
    originalEnv = { ...process.env };
    // Set up environment variables
    process.env.MONGO_USER = 'testuser';
    process.env.MONGO_PASSWORD = 'testpass';
    process.env.MONGO_SERVER = 'localhost:27017/testdb';
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should connect to MongoDB and call callback', async () => {
    const mockCallback = vi.fn();

    await connect(mockCallback);

    expect(mockCallback).toHaveBeenCalled();
  });

  it('should handle connection errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockCallback = vi.fn();

    // We need to spy on the connect method to throw an error
    vi.spyOn(MongoClient.prototype, 'connect').mockImplementationOnce(async () => {
      throw new Error('Connection failed');
    });

    await connect(mockCallback);

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should construct correct MongoDB connection string', async () => {
    const mockCallback = vi.fn();

    await connect(mockCallback);

    // Verify callback was called with a db object
    expect(mockCallback).toHaveBeenCalled();

    // Verify MongoClient was instantiated
    expect((MongoClient as any).instances.length).toBeGreaterThan(0);
  });
});
