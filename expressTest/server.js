var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.send("Hello from express!");
});

app.get('/test',function(req,res){
    res.send("Yes! its working");
});

app.listen(8080);
