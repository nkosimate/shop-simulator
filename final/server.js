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
app.get('/register', function (req, res) {
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
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    //get the requested user based on their username, eg /profile?username=dioreticllama
    //console.log(uname+ ":" + result);
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "login.username": currentuser }, function (err, result) {
        if (err) throw err;
        console.log(result);
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                //user: result,
                productarray: presult
            })

        })
    });
});


//this is the admin route. should only be accessed by admin
app.get('/admin', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    var currentuser = req.session.currentuser;
    console.log("the curent user is =  "  + currentuser);
    db.collection('users').findOne({ "login.username": currentuser }, function (err, result) {
        if (err) throw err;
        //finally we just send the result to the user page as "user"
        console.log(result);
        res.render('pages/admin', {
            //user: result
        })
    });
});

//logs user out then redirects to home page
app.get('/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/login');
});

//********** POST ROUTES - Deal with processing data from forms ***************************


//the dologin route detasl with the data from the login screen.
//the post variables, username and password ceom from the form on the login page.
app.post('/dologin', function (req, res) {
    console.log(JSON.stringify(req.body))
    var uname = req.body.username;
    var pword = req.body.password;



    db.collection('users').findOne({ "login.username": uname }, function (err, result) {
        if (err) throw err;//if there is an error, throw the error
        //if there is no result, redirect the user back to the login system as that username must not exist
        if (!result) { res.redirect('/login'); return }
        //if there is a result then check the password, if the password is correct set session loggedin to true and send the user to the index
        if (result.login.password == pword) {
            req.session.loggedin = true;
            if (uname == "admin") {
                console.log('admin has loged in');
                res.redirect('/admin')
            } else {
                console.log('user has loged in');
                res.redirect('/shop')
            }
        }
        //otherwise send them back to login
        else {
            console.log('login fail');
            res.redirect('/login')
        }
    });
});


app.post('/buyproduct1', function (req, res) {
    db.collection('product').findOne({ "name": "Yeezy 350" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Yeezy 350" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})


app.post('/sellproduct1', function (req, res) {
    db.collection('product').findOne({ "name": "Yeezy 350" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice - 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Yeezy 350" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct2', function (req, res) {
    db.collection('product').findOne({ "name": "Balenciaga" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Balenciaga" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct2', function (req, res) {
    db.collection('product').findOne({ "name": "Balenciaga" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice - 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Balenciaga" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct3', function (req, res) {
    db.collection('product').findOne({ "name": "Crocs" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Crocs" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct3', function (req, res) {
    db.collection('product').findOne({ "name": "Crocs" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice - 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Crocs" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct4', function (req, res) {
    db.collection('product').findOne({ "name": "Pandas" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Pandas" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct4', function (req, res) {
    db.collection('product').findOne({ "name": "Pandas" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Pandas" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct5', function (req, res) {
    db.collection('product').findOne({ "name": "Dunk blue" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Dunk blue" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct5', function (req, res) {
    db.collection('product').findOne({ "name": "Dunk blue" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Dunk blue" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})


app.post('/buyproduct6', function (req, res) {
    db.collection('product').findOne({ "name": "Heels" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Heels" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct6', function (req, res) {
    db.collection('product').findOne({ "name": "Heels" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Heels" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct7', function (req, res) {
    db.collection('product').findOne({ "name": "Grey Jordan1s" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Grey Jordan1s" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct7', function (req, res) {
    db.collection('product').findOne({ "name": "Grey Jordan1s" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Grey Jordan1s" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct8', function (req, res) {
    db.collection('product').findOne({ "name": "Blue Jordan1s" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Blue Jordan1s" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct8', function (req, res) {
    db.collection('product').findOne({ "name": "Blue Jordan1s" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Blue Jordan1s" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct9', function (req, res) {
    db.collection('product').findOne({ "name": "Yeezy runner" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Yeezy runner" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct9', function (req, res) {
    db.collection('product').findOne({ "name": "Yeezy runner" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Yeezy runner" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/buyproduct10', function (req, res) {
    db.collection('product').findOne({ "name": "Yeezy slides" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Yeezy slides" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

app.post('/sellproduct10', function (req, res) {
    db.collection('product').findOne({ "name": "Yeezy slides" }, { "price": 1 }, function (err, result) {
        if (err) throw err;
        var results = Object.values(result);
        //console.log("the old price");
        var oldprice = results[1];
        var newPrice = oldprice + 5;
        //console.log(newPrice)
        //update price
        var newvalue = { $set: { price: newPrice } };
        db.collection('product').updateOne({ "name": "Yeezy slides" }, newvalue, function (err, result) {
            if (err) throw err;

        })
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                productarray: presult
            })
        })
    });
})

