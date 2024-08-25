const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
var bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.NODE_APP_PORT;

const username = encodeURIComponent(process.env.MONGO_DB_USER);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const dbUrl = `mongodb://${username}:${password}@mongodb:27017/?authMechanism=DEFAULT`;
const dbName = process.env.MONGO_DB;

app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(dbUrl)
    .then(client => {
        console.log('Connected to Database');
        const db = client.db(dbName);
        const countersCollection = db.collection(process.env.COUNTER_COLLECTION);
        const userCollection = db.collection(process.env.USER_COLLECTION);
        
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
            const query =  req.query.map == 'All' ? {} : { map: req.query.map };

            let pipeline = 
                [
                    { $group: {
                        _id: "$map",
                        ctRound1Win: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$round1" ] }, { $and: [ "$secondHalfSideCT", "$secondround1" ] } ] }, 1, 0 ] } },
                        ctRound1Loss: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$round1" ] }, { $and: [ "$secondHalfSideCT", "$secondround1" ] } ] }, 0, 1 ] } },
                        ctRound2Win: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$round2" ] }, { $and: [ "$secondHalfSideCT", "$secondround2" ] } ] }, 1, 0 ] } },
                        ctRound2Loss: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$round2" ] }, { $and: [ "$secondHalfSideCT", "$secondround2" ] } ] }, 0, 1 ] } },
                        tRound1Win: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$secondround1" ] }, { $and: [ "$secondHalfSideCT", "$round1" ] } ] }, 1, 0] } },
                        tRound1Loss: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$secondround1" ] }, { $and: [ "$secondHalfSideCT", "$round1" ] } ] }, 0, 1 ] } },
                        tRound2Win: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$secondround2" ] }, { $and: [ "$secondHalfSideCT", "$round2" ] } ] }, 1, 0 ] } },
                        tRound2Loss: { $sum: { $cond: [ { $or: [ { $and: [ "$firstHalfSideCT", "$secondround2" ] }, { $and: [ "$secondHalfSideCT", "$round2" ] } ] }, 0, 1 ] } },
                        gamesWon: { $sum: { $cond: ["$matchResult", 1, 0] } },
                        gamesLost: { $sum: { $cond: ["$matchResult", 0, 1] } },
                        ctRound2WinAfterRound1Win: { $sum: { $cond: [ { $or: [ { $and: [ { $and: [ "$firstHalfSideCT", "$round1" ] }, "$round2" ] }, { $and: [ { $and: [ "$secondHalfSideCT", "$secondround1" ] }, "$secondround2" ] }, ] }, 1, 0 ] } },
                        ctRound2LossAfterRound1Win: {
                            $sum: {
                            $cond: [
                                {
                                $or: [
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$firstHalfSideCT",
                                            "$round1"
                                        ]
                                        },
                                        {$not: ["$round2"]}
                                    ]
                                    },
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$secondHalfSideCT",
                                            "$secondround1"
                                        ]
                                        },
                                        {$not: ["$secondround2"]}
                                    ]
                                    },
                                ]
                                },
                                1,
                                0
                            ]
                            }
                        },
                        ctRound2WinAfterRound1Loss: {
                            $sum: {
                            $cond: [
                                {
                                $or: [
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$firstHalfSideCT",
                                            {$not: ["$round1"]}
                                        ]
                                        },
                                        "$round2"
                                    ]
                                    },
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$secondHalfSideCT",
                                            {$not: ["$secondround1"]}
                                        ]
                                        },
                                        "$secondround2"
                                    ]
                                    },
                                ]
                                },
                                1,
                                0
                            ]
                            }
                        },
                        ctRound2LossAfterRound1Loss: {
                            $sum: {
                            $cond: [
                                {
                                $or: [
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$firstHalfSideCT",
                                            {$not: ["$round1"]}
                                        ]
                                        },
                                        {$not: ["$round2"]}
                                    ]
                                    },
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$secondHalfSideCT",
                                            {$not: ["$secondround1"]}
                                        ]
                                        },
                                        {$not: ["$secondround2"]}
                                    ]
                                    },
                                ]
                                },
                                1,
                                0
                            ]
                            }
                        },
                        tRound2WinAfterRound1Win: {
                            $sum: {
                            $cond: [
                                {
                                $or: [
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$secondHalfSideCT",
                                            "$round1"
                                        ]
                                        },
                                        "$round2"
                                    ]
                                    },
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$firstHalfSideCT",
                                            "$secondround1"
                                        ]
                                        },
                                        "$secondround2"
                                    ]
                                    },
                                ]
                                },
                                1,
                                0
                            ]
                            }
                        },
                        tRound2LossAfterRound1Win: {
                            $sum: {
                            $cond: [
                                {
                                $or: [
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$secondHalfSideCT",
                                            "$round1"
                                        ]
                                        },
                                        {$not: ["$round2"]}
                                    ]
                                    },
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$firstHalfSideCT",
                                            "$secondround1"
                                        ]
                                        },
                                        {$not: ["$secondround2"]}
                                    ]
                                    },
                                ]
                                },
                                1,
                                0
                            ]
                            }
                        },
                        tRound2WinAfterRound1Loss: {
                            $sum: {
                            $cond: [
                                {
                                $or: [
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$secondHalfSideCT",
                                            {$not: ["$round1"]}
                                        ]
                                        },
                                        "$round2"
                                    ]
                                    },
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$firstHalfSideCT",
                                            {$not: ["$secondround1"]}
                                        ]
                                        },
                                        "$secondround2"
                                    ]
                                    },
                                ]
                                },
                                1,
                                0
                            ]
                            }
                        },
                        tRound2LossAfterRound1Loss: {
                            $sum: {
                            $cond: [
                                {
                                $or: [
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$secondHalfSideCT",
                                            {$not: ["$round1"]}
                                        ]
                                        },
                                        {$not: ["$round2"]}
                                    ]
                                    },
                                    {
                                    $and: [
                                        {
                                        $and: [
                                            "$firstHalfSideCT",
                                            {$not: ["$secondround1"]}
                                        ]
                                        },
                                        {$not: ["$secondround2"]}
                                    ]
                                    },
                                ]
                                },
                                1,
                                0
                            ]
                            }
                        },
                    }},
                    {$sort: { _id: 1 }}
                ];


            if (req.query.map != 'All'){
                //pipeline.push({$match: { map: req.query.map }});
                pipeline = [{$match: { map: req.query.map }}, pipeline[0]];
            }
            else {
                //pipeline =[pipeline]
            }

            countersCollection.aggregate(pipeline)
                .toArray()
                .then(response => {
                res.send(response);
                })
                .catch(error => console.error(error));
        });

        app.use(express.static(__dirname + '/public'));

        app.set('view engine', 'pug');

        app.get('/register', (req, res) => {
            res.render('register', {
                title: 'Register'
            });
        });

        app.post('/register', (req, res) => {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.password, salt);
            userCollection.insertOne(
                { 
                    username: req.body.username, 
                    password: hash,
                    email: req.body.email
                },
                { upsert: true }
            )
            .then(response =>  {
                res.send({ id: response.insertedId });
            })
            .catch(error => console.error(error));
        });

        app.get('/register.js',function(req,res){
            res.sendFile(__dirname + '/js/register.js',{}); 
        });

        app.get('/login', (req, res) => {
            res.render('login', {
                title: 'Login'
            });
        });

        app.post('/login', (req, res) => {
            userCollection.findOne({
                username: req.body.username
            })
            .then (response => {
                console.log(response);

                if (response == null){
                    res.send('User does not exist');
                }
                
                if (bcrypt.compareSync(req.body.password, response.password)) {
                    res.send('Authenticated');
                }
                else {
                    res.send('Invalid');
                }
                
            })
            .catch (error => console.error(error));
        });

        app.get('/login.js',function(req,res){
            res.sendFile(__dirname + '/js/login.js',{}); 
        });

        app.get('/', (req, res) => {
            res.render('home', {
                title: 'Home'
            });
        });

        app.get('/home.js', (req,res) => {
            res.sendFile(__dirname + '/js/home.js',{}); 
        });

        app.get('/stats', (req, res) => {
            res.render('stats', {
                title: 'Stats'
            });
        });

        app.get('/stats.js', (req, res) => {
            res.sendFile(__dirname + '/js/stats.js');
        });
        
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(console.error);
