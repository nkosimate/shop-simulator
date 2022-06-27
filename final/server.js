const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/shop";
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));

//code to tell express we want to read POSTED forms
app.use(bodyParser.urlencoded({
    extended: true
}))

//variable to hold our Database
var db;

//this is our connection to the mongo db, ts sets the variable db as our database
MongoClient.connect(url, function (err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('listening on 8080');
});

// set the view engine to ejs
app.set('view engine', 'ejs');


//home page
//Default goes to Home//
app.get('/', function (req, res) {
    res.render('pages/home');
});
//Gets Home.ejs//
app.get('/home', function (req, res) {
    res.render('pages/home');
});

//login page
app.get('/login', function (req, res) {
    res.render('pages/login')
});

//create account page
app.get('createAccount', function (req, res) {
    res.render('pages/createAcc')
});