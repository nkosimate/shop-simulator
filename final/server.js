const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/shop";
var express = require('express');
var app = express();
var db;

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

// set the view engine to ejs
app.set('view engine', 'ejs');


//Sets up the Mongodb database//
MongoClient.connect(url, function (err, database) {
    if (err) throw err;
    db = database;
    app.listen(8080);
    console.log('listening on 8080');
  });

//home page
app.get('/', function (req, res) {
    res.render('/home');
});

//login page
app.get('/login',function(req,res){
    res.render('/login')
});

//create account page
app.get('createAccount',function(req,res){
    res.render('/createAcc')
});

app.listen(8080);