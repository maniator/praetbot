const { MongoClient } = require('mongodb');

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const connect = function (cb : Function = (() => {})) {
    // Connection URL
    var url = `mongodb://${user}:${password}@ds157487.mlab.com:57487/praet-bot`;
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
