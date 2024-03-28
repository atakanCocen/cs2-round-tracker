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

        app.use(express.static('public'));

        app.get('/', function (req, res) {
            res.sendFile('/Users/atakancocen/cs2-round-tracker/index.html', {});
          });

        app.get('/script.js',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/script.js',{}); 
        });

        app.get('/de_anubis.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_anubis.png',{}); 
        });

        app.get('/de_mirage.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_mirage.png',{}); 
        });

        app.get('/de_ancient.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_ancient.png',{}); 
        });

        app.get('/de_dust2.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_dust2.png',{}); 
        });

        app.get('/de_inferno.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_inferno.png',{}); 
        });

        app.get('/de_overpass.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_overpass.png',{}); 
        });

        app.get('/de_nuke.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_nuke.png',{}); 
        });

        app.get('/de_vertigo.png',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/public/images/de_vertigo.png',{}); 
        });
        
        app.get('/main.css',function(req,res){
            res.sendFile('/Users/atakancocen/cs2-round-tracker/assets/css/main.css',{}); 
        });

        
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(console.error);
