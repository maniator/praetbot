const { MongoClient } = require('mongodb');

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const mongoServer = process.env.MONGO_SERVER;

const connect = function (cb : Function = (() => {})) {
    // Connection URL
    var url = `mongodb://${user}:${password}@${mongoServer}`;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err : Object, db : any) {
        if (!err) {
            console.log("Connected correctly to server");

            cb(db);
        } else {
            console.log(err);
        }
    });
};

export { connect };
