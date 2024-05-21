const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const Chart = require('chart.js/auto');

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
        
        app.post('/rounds-submit', (req, res) => {
            countersCollection.insertOne(
                { 
                    name: 'roundTracker', 
                    map: req.query.map, 
                    firstHalfSideCT: req.body.matchStartingSideCT == 'true', 
                    round1: req.body.round1 == 'true', 
                    round2: req.body.round2 == 'true', 
                    secondHalfSideCT: req.body.matchSecondSideCT == 'true', 
                    secondround1: req.body.secondround1 == 'true', 
                    secondround2: req.body.secondround2 == 'true', 
                    matchResult: req.body.matchResult == 'true',
                    timeStamp: new Date().toLocaleString() 
                },
                { upsert: true }
            )
            .then(response =>  {
                res.send({ id: response.insertedId });
            })
            .catch(error => console.error(error));        
        });

        app.get('/get-stats', (req, res) => {
            const query = { name: 'roundTracker', map: req.query.map };
            countersCollection.find(query)
            .toArray()
            .then(response => {
                res.send(response);
                console.log(response);
            })
            .catch(error => console.error(error));
        });

        var test = express.static('/public');
        app.use(express.static(__dirname + '/public'));

        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/pages/home/index.html');
        });

        app.get('/home.js',function(req,res){
            res.sendFile(__dirname + '/pages/home/home.js',{}); 
        });

        app.get('/stats', function (req, res) {
            res.sendFile(__dirname + '/pages/stats/stats.html');
        });

        app.get('/stats.js', function (req, res) {
            res.sendFile(__dirname + '/pages/stats/stats.js');
        });
        
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(console.error);
