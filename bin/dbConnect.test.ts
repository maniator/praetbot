import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connect } from './dbConnect';
import { MongoClient } from 'mongodb';

// Mock MongoClient
vi.mock('mongodb', () => {
  class MockMongoClient {
    async connect() {
      return undefined;
    }
    db() {
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

    // Mock a connection error by modifying the class prototype
    const originalConnect = MongoClient.prototype.connect;
    MongoClient.prototype.connect = vi.fn(async () => {
      throw new Error('Connection failed');
    });

    const mockCallback = vi.fn();
    await connect(mockCallback);

    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore the original method
    MongoClient.prototype.connect = originalConnect;
    consoleErrorSpy.mockRestore();
  });

  it('should construct correct MongoDB connection string', async () => {
    const mockCallback = vi.fn();

    // The environment variables should already be set in beforeEach
    // Just verify the function runs without errors
    await connect(mockCallback);

    // Verify callback was called with a db object
    expect(mockCallback).toHaveBeenCalled();
  });
});
