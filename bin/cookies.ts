import {connect} from './dbConnect';
const assert = require('assert')

interface User {
    name: string;
    id: string;
    cookies?: number;
}

const createUser = function (user : User, collection : any, callback : Function) {
    collection.insert(user, callback);
};

const updateUser = function (user : User, collection : any, callback : Function) {
    collection.updateOne({id: user.id}, { $set: { cookies: user.cookies }}, callback);
};

const updateCookie = function (user : User) : Promise<User> {
    return new Promise ((res) => {
        connect(function (db : any) {
            // Get the cookie collection
            var collection = db.collection('cookie');

            const userUpdated = () => {
                res(user);
                db.close();
            };

            collection.find({
                id: user.id
            }).toArray(function (err: any, users: User[]) {
                if (users.length === 0) {
                    createUser(user, collection, userUpdated);
                } else {
                    updateUser(user, collection, userUpdated);
                }
            });
        });
    });
};

const getCookieByUserId = function (userId : string) : Promise<User> {
    return new Promise((res) => {
        connect(function (db : any) {
            // Get the cookie collection
            var collection = db.collection('cookie');

            collection.find({ id: userId }).toArray(function (err : any, cookies : User[]) {
                if (cookies.length === 1) {
                    res(cookies[0] as User);
                }

                res(null);

                db.close();
            });
        });
    });
}

const getCookies = function () : Promise<User[]> {
    return new Promise((res) => {
        connect(function (db : any) {
            // Get the cookie collection
            var collection = db.collection('cookie');

            collection.find({}).toArray(function (err : any, cookies : User[]) {
                res(cookies);
                db.close();
            });
        });
    });
};

export {
    updateCookie,
    getCookies,
    getCookieByUserId,
};
