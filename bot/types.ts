import { Db } from 'mongodb';

// MongoDB database type with proper typing
export type MongoDatabase = Db;

// Command stored in database
export interface StoredCommand {
  _id: string;
  value?: string;
  respond?: string;
}

// Command names registry type
export interface CommandRegistry {
  [key: string]: {
    name: string;
    run: (args?: string) => Promise<string> | string;
  };
}
