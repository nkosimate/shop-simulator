const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/shop";
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(express.static('public'));

//code to tell express we want to read POSTED forms
app.use(bodyParser.urlencoded({
    extended: true
}))

//this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example' }));

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
app.get('register', function (req, res) {
    res.render('pages/register')
});

//logour route cause the page to Logout.
//it sets our session.loggedin to false and then redirects the user to the login
app.get('/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});

//this is our shop route, it takes in a username and uses that to search the database for a specific user
app.get('/shop', function (req, res) {
    if (!req.session.loggedin) { res.redirect('pages/login'); return; }
    //get the requested user based on their username, eg /profile?username=dioreticllama
    var uname = req.query.username;
    //this query finds the first document in the array with that username.
    //Because the username value sits in the login section of the user data we use login.username
    db.collection('users').findOne({
        "login.username": uname
    }, function (err, result) {
        if (err) throw err;
        console.log(uname+ ":" + result);
        //finally we just send the result to the user page as "user"
        res.render('pages/shop', {
            user: result
        })
    });

});