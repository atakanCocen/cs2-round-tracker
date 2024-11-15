const { MongoClient } = require('mongodb');
require('dotenv').config();

const username = encodeURIComponent(process.env.MONGO_DB_USER);
const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const dbUrl = `mongodb://${username}:${password}@mongodb:27017/?authMechanism=DEFAULT`;
const dbName = process.env.MONGO_DB;

async function addMatchResult(username, request){
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbUrl)
            .then(client => {
                console.log('Connected to Database');
                const db = client.db(dbName);
                const countersCollection = db.collection(process.env.COUNTER_COLLECTION);
                countersCollection.insertOne(
                    { 
                        name: 'roundTracker',
                        user: username,
                        map: request.map,
                        firstHalfSideCT: request.firstHalfSideCT == 'true', 
                        round1: request.round1 == 'true', 
                        round2: request.round2 == 'true', 
                        secondHalfSideCT: request.secondHalfSideCT == 'true', 
                        secondround1: request.secondround1 == 'true', 
                        secondround2: request.secondround2 == 'true', 
                        matchResult: request.matchResult == 'true',
                        timeStamp: new Date().toLocaleString() 
                    },
                    { upsert: true }
                )
                    .then(response =>  {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });    
            })
    })
}

async function getStatsForUser(username, map){
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbUrl)
            .then(client => {
                console.log('Connected to Database');
                const db = client.db(dbName);
                const countersCollection = db.collection(process.env.COUNTER_COLLECTION);
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
                        ctRound2LossAfterRound1Win: {$sum: { $cond: [ {$or: [
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

                if (map != 'All'){
                    pipeline = [{$match: { map: map, user: username }}, pipeline[0]];
                }
                else {
                    pipeline = [{$match: { user: username }}, pipeline[0]];
                }

                countersCollection.aggregate(pipeline)
                    .toArray()
                    .then(response => 
                        {
                            console.log(response);
                            resolve(response);
                        })
                .catch(error => {
                    reject(error)
                })
        })
    })

    

    
}

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

module.exports = {addMatchResult, getStatsForUser, retrieveUser};

