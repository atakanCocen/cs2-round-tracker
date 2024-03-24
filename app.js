const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'mydatabase';

app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(dbUrl)
    .then(client => {
        console.log('Connected to Database');
        const db = client.db(dbName);
        const countersCollection = db.collection('counters');

        // Endpoint to increment counter
        app.post('/increment', (req, res) => {
            countersCollection.updateOne(
                { name: 'clickCounter' },
                { $inc: { count: 1 } },
                { upsert: true }
            )
            .then(result => res.json({ success: true }))
            .catch(error => console.error(error));
        });

        app.get('/', function (req, res) {
            res.sendFile('/Users/atakancocen/Downloads/cs2roundtemplate/index.html', {});
          });

        app.get('/script.js',function(req,res){
            res.sendFile('/Users/atakancocen/Downloads/cs2roundtemplate/script.js',{}); 
        });

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(console.error);
