import { MongoClient, Db } from 'mongodb';

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const mongoServer = process.env.MONGO_SERVER;

// Connection URL
const mongoUri = process.env.MONGODB_URI ?? `mongodb://${user}:${password}@${mongoServer}`;
const dbName = process.env.MONGODB_DB ?? 'praetbot';

const connect = async function (cb: (db: Db) => Promise<void> | void): Promise<void> {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Connected correctly to server');

    const db = client.db(dbName);
    await cb(db);
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

export { connect };


