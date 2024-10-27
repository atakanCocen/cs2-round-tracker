const { MongoClient } = require('mongodb');
require('dotenv').config();

const username = encodeURIComponent(process.env.MONGO_DB_USER);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const dbUrl = `mongodb://${username}:${password}@mongodb:27017/?authMechanism=DEFAULT`;
const dbName = process.env.MONGO_DB;


function connectToCountersCollection () {
    MongoClient.connect(dbUrl)
    .then(client => {
        console.log('Connected to Database');
        const db = client.db(dbName);
        const countersCollection = db.collection(process.env.COUNTER_COLLECTION);
        return countersCollection;
    });
};

async function retrieveUser (username) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(dbUrl)
            .then(client => {
                console.log('Connected to Database');
                const db = client.db(dbName);
                const userCollection = db.collection(process.env.USER_COLLECTION);
                userCollection.findOne({
                    username: username
                })
                    .then(response => {
                        console.log('USER FOUND');
                        console.log(response);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
      });
    
};

module.exports = {connectToCountersCollection, retrieveUser};

