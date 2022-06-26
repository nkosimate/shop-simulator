var express = require('express');
var app = express();


app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');


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