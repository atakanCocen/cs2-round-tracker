const express = require('express');
const bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.NODE_APP_PORT;

const db = require('./js/middleware/db');

const {verifyToken, getDecodedToken} = require('./js/middleware/auth');

const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.set('view engine', 'pug');

app.get('/login', (req, res) => {
    console.log(req.cookies.token);

    if (req.cookies.token !== undefined && verifyToken(req.cookies.token, 'your-secret-key')){
        res.redirect('/');
    }
    else {
        res.render('login', {
            title: 'Login/Register'
        });
    }
});


app.post('/login', (req, res) => {
    db.retrieveUser(req.body.username)
    .then (response => {

        if (response == null){
            res.send('User does not exist');
        }
        
        if (bcrypt.compareSync(req.body.password, response.password)) {
            const token = jwt.sign({ userId: req.body.username }, 'your-secret-key', {
                expiresIn: '1h',
            });
            res.cookie('token', token, { 
                httpOnly: true, 
                secure: true, 
                sameSite: 'strict' ,
                maxAge: 1000 * 60 * 30
                });
            
            res.json({ success: true,  message: 'Logged in successfully' });
        }
        else {
            res.status(401).send('Invalid Username/Password combo');
        }
        
    })
    .catch (error => console.error(error));
});

app.post('/register', (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    
    db.createUser(req.body.username, hash, req.body.email)
        .then(response => {
            const token = jwt.sign({ userId: req.body.username }, 'your-secret-key', {
                expiresIn: '1h',
            });

            res.cookie('token', token, { 
                httpOnly: true, 
                secure: true, 
                sameSite: 'strict' ,
                maxAge: 1000 * 60 * 30
            });
            
            res.json({ success: true,  message: 'User successfully registered' });

        })
        .catch(error => console.error(error));
});

app.get('/login.js',function(req,res){
    res.sendFile(__dirname + '/js/login.js',{}); 
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.get('/', (req, res) => {
    if (req.cookies.token == undefined || !verifyToken(req.cookies.token, 'your-secret-key')){
        res.redirect('login');
    }
    else {
        res.render('home', {
            title: 'Home'
        });
    }
});


app.get('/home.js', (req,res) => {
    res.sendFile(__dirname + '/js/home.js',{}); 
});


app.get('/stats', (req, res) => {
    if (req.cookies.token == undefined || !verifyToken(req.cookies.token, 'your-secret-key')){
        res.redirect('login');
    }
    else {
        res.render('stats', {
            title: 'Stats'
        });
    }
});


app.get('/stats.js', (req, res) => {
    res.sendFile(__dirname + '/js/stats.js');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


app.post('/rounds-submit', (req, res) => {
    let decodedToken = getDecodedToken(req.cookies.token, 'your-secret-key');
    db.addMatchResult(decodedToken.userId, 
        {
            map: req.query.map, 
            firstHalfSideCT: req.body.matchStartingSideCT, 
            round1: req.body.round1, 
            round2: req.body.round2, 
            secondHalfSideCT: req.body.matchSecondSideCT, 
            secondround1: req.body.secondround1, 
            secondround2: req.body.secondround2, 
            matchResult: req.body.matchResult,
        }
    )
    .then(response =>  {
        console.log(response);
        res.send({ id: response.insertedId });
    })
    .catch(error => console.error(error));        
});


app.get('/get-stats', (req, res) => {
    let decodedToken = getDecodedToken(req.cookies.token, 'your-secret-key');
    db.getStatsForUser(decodedToken.userId, req.query.map)
    .then(response => {
        res.send(response);
    })
    .catch(error => console.error(error));
});

