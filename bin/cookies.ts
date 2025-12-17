import { connect } from './dbConnect.js';
import { Collection } from 'mongodb';

interface CookieUser {
  name: string;
  id: string;
  cookies?: number;
}

const createCookieUser = async function (
  cookieUser: CookieUser,
  collection: Collection
): Promise<void> {
  await collection.insertOne(cookieUser);
};

const updateCookieUser = async function (
  cookieUser: CookieUser,
  collection: Collection
): Promise<void> {
  await collection.updateOne({ id: cookieUser.id }, { $set: { cookies: cookieUser.cookies } });
};

const updateCookie = function (cookieUser: CookieUser): Promise<CookieUser> {
  return new Promise((res) => {
    connect(async (db) => {
      const collection = db.collection('cookie');

      const existingUsers = await collection.find({ id: cookieUser.id }).toArray();

      if (existingUsers.length === 0) {
        await createCookieUser(cookieUser, collection);
      } else {
        await updateCookieUser(cookieUser, collection);
      }

      res(cookieUser);
    });
  });
};

const getCookieByUserId = function (cookieUserId: string): Promise<CookieUser | null> {
  return new Promise((res) => {
    connect(async (db) => {
      const collection = db.collection('cookie');

      const cookies = await collection.find({ id: cookieUserId }).toArray();

      if (cookies.length === 1) {
        res(cookies[0] as CookieUser);
      } else {
        res(null);
      }
    });
  });
};

const getCookies = function (): Promise<CookieUser[]> {
  return new Promise((res) => {
    connect(async (db) => {
      const collection = db.collection('cookie');
      const cookies = await collection.find({}).toArray();
      res(cookies as CookieUser[]);
    });
  });
};

export { updateCookie, getCookies, getCookieByUserId, CookieUser };
