var express = require('express');
var app = express();


app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');


//home page
//Default goes to Home//
app.get('/', function (req, res) {
    res.render('pages/home');
  });

//login page
app.get('/login',function(req,res){
    res.render('pages/login')
});

//create account page
app.get('createAccount',function(req,res){
    res.render('pages/createAcc')
});

app.listen(8080);