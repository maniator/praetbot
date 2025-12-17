import { MongoClient, Db } from 'mongodb';

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const mongoServer = process.env.MONGO_SERVER;

const connect = async function (cb: (db: Db) => Promise<void> | void): Promise<void> {
    // Connection URL
    const url = `mongodb://${user}:${password}@${mongoServer}`;
    
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        console.log("Connected correctly to server");
        
        const db = client.db();
        await cb(db);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

export { connect };
