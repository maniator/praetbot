import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connect } from './dbConnect';
import { MongoClient } from 'mongodb';

// Mock MongoClient
vi.mock('mongodb', () => ({
  MongoClient: vi.fn(() => ({
    connect: vi.fn(async () => undefined),
    db: vi.fn(() => ({
      collection: vi.fn(),
    })),
  })),
}));

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

    // Mock a connection error
    const MockedMongoClient = MongoClient as unknown as vi.Mock;
    MockedMongoClient.mockImplementationOnce(() => ({
      connect: vi.fn(async () => {
        throw new Error('Connection failed');
      }),
      db: vi.fn(),
    }));

    const mockCallback = vi.fn();
    await connect(mockCallback);

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should construct correct MongoDB connection string', async () => {
    const mockCallback = vi.fn();

    // The environment variables should already be set in beforeEach
    // Just verify the function runs without errors
    await connect(mockCallback);

    // Verify callback was called with a db object
    expect(mockCallback).toHaveBeenCalled();

    // Verify MongoClient was instantiated
    const MockedMongoClient = MongoClient as unknown as vi.Mock;
    expect(MockedMongoClient).toHaveBeenCalled();

    // Get the connection string that was used
    const connectionString =
      MockedMongoClient.mock.calls[MockedMongoClient.mock.calls.length - 1][0];
    expect(connectionString).toContain('mongodb://');
  });
});
