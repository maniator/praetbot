import {connect} from './dbConnect';
const assert = require('assert')

interface CookieUser {
    name: string;
    id: string;
    cookies?: number;
}

const createCookieUser = function (cookieUser : CookieUser, collection : any, callback : Function) {
    collection.insert(cookieUser, callback);
};

const updateCookieUser = function (cookieUser : CookieUser, collection : any, callback : Function) {
    collection.updateOne({id: cookieUser.id}, { $set: { cookies: cookieUser.cookies }}, callback);
};

const updateCookie = function (cookieUser : CookieUser) : Promise<CookieUser> {
    return new Promise ((res) => {
        connect(function (db : any) {
            // Get the cookie collection
            var collection = db.collection('cookie');

            const cookieUserUpdated = () => {
                res(cookieUser);
                db.close();
            };

            collection.find({
                id: cookieUser.id
            }).toArray(function (err: any, CookieUsers: CookieUser[]) {
                if (CookieUsers.length === 0) {
                    createCookieUser(cookieUser, collection, cookieUserUpdated);
                } else {
                    updateCookieUser(cookieUser, collection, cookieUserUpdated);
                }
            });
        });
    });
};

const getCookieByUserId = function (cookieUserId : string) : Promise<CookieUser> {
    return new Promise((res) => {
        connect(function (db : any) {
            // Get the cookie collection
            var collection = db.collection('cookie');

            collection.find({ id: cookieUserId }).toArray(function (err : any, cookies : CookieUser[]) {
                if (cookies.length === 1) {
                    res(cookies[0] as CookieUser);
                }

                res(null);

                db.close();
            });
        });
    });
}

const getCookies = function () : Promise<CookieUser[]> {
    return new Promise((res) => {
        connect(function (db : any) {
            // Get the cookie collection
            var collection = db.collection('cookie');

            collection.find({}).toArray(function (err : any, cookies : CookieUser[]) {
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
    CookieUser,
};
