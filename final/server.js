const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/shop";
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
        if (err) throw err;
        //console.log(result);
        db.collection('product').find().toArray(function (err, presult) {
            res.render('pages/shop', {
                user: result,
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
    db.collection('users').findOne({ "name": "admin" }, function (err, result) {
        if (err) throw err;
        res.render('pages/admin', {
            user: result,
        })

    });
});


//logs user out then redirects to home page
app.get('/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/login');
});

//failed transaction
app.get('/failsell',function(req,res){
    res.render('pages/failsell')
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
                req.session.loggedin = true;
                req.session.currentuser = uname;
                res.redirect('/admin')
            } else {
                console.log('user has loged in');
                req.session.loggedin = true;
                req.session.currentuser = uname;
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
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Yeezy 350" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p1": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p1": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Yeezy 350" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})


app.post('/sellproduct1', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Yeezy 350" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p1": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p1": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Yeezy 350" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct2', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Balenciaga" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p2": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p2": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Balenciaga" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct2', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Balenciaga" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p2": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p2": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Balenciaga" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct3', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Crocs" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p3": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p3": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Crocs" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct3', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Crocs" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p3": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p3": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Crocs" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct4', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Pandas" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p4": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p4": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Pandas" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct4', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Pandas" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p4": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p4": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Pandas" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct5', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Dunk blue" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p5": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p5": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Dunk blue" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct5', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Dunk blue" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p5": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p5": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Dunk blue" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})


app.post('/buyproduct6', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Heels" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p6": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p6": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Heels" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct6', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Heels" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p6": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p6": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Heels" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct7', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Grey Jordan1s" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p7": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p7": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Grey Jordan1s" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct7', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Grey Jordan1s" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p7": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p7": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Grey Jordan1s" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct8', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Blue Jordan1s" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p8": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p8": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Blue Jordan1s" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct8', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Blue Jordan1s" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p8": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p8": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Blue Jordan1s" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct9', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Yeezy runner" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p9": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p9": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Yeezy runner" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct9', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Yeezy runner" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p9": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p9": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Yeezy runner" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/buyproduct10', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Yeezy slides" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice + 5;

                //update price in product db
                //update stock p1, balance and total in user db for that user
                db.collection('users').findOne({ "name": currentuser }, { "stock.p10": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] - oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    var newStock = parseInt(stockValue) + 1;
                    var newTotal = resultsforUser[3] + 150;
                    var newvalueProduct = { $set: { price: newPrice } };
                    var newvalueStock = { $set: { "stock.p10": newStock, balance: newBalance, total: newTotal } };
                    db.collection('product').updateOne({ "name": "Yeezy slides" }, newvalueProduct, function (err, result) {
                        if (err) throw err;
                    });
                    db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                        if (err) throw err;
                        console.log('user stock updated');
                    });
                    db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                        if (err) throw err;
                        //console.log(result);
                        db.collection('product').find().toArray(function (err, presult) {
                            res.render('pages/shop', {
                                user: result,
                                productarray: presult
                            })

                        })
                    });
                });
            });
        }
    });
})

app.post('/sellproduct1', function (req, res) {
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({ "name": "admin" }, { "start": 1 }, function (err, shouldWeStart) {
        if (err) throw err;
        var shouldWeStart1 = Object.values(shouldWeStart);
        var shouldWeStart2 = shouldWeStart1[1];
        console.log("the value of should we start" + shouldWeStart2)
        if (shouldWeStart2 == 0) {
            console.log("don't start")
            db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                if (err) throw err;
                //console.log(result);
                db.collection('product').find().toArray(function (err, presult) {
                    res.render('pages/shop', {
                        user: result,
                        productarray: presult
                    })

                })
            });
        } else {
            db.collection('product').findOne({ "name": "Yeezy slides" }, { "price": 1 }, function (err, result) {
                if (err) throw err;
                //update price
                var results = Object.values(result);
                var oldprice = results[1];
                var newPrice = oldprice - 5;
                var currentuser = req.session.currentuser;
                //update stock p1, balance and total in user db for that user
                //check if they have the stocl to sell
                db.collection('users').findOne({ "name": currentuser }, { "stock.p10": 1, "balance": 1, "total": 1 }, function (err, userresults) {
                    if (err) throw err;
                    var resultsforUser = Object.values(userresults);
                    var newBalance = resultsforUser[1] + oldprice;
                    var stockValue = Object.values(resultsforUser[2]);
                    if (stockValue > 0) {
                        var newStock = parseInt(stockValue) - 1;
                        var newTotal = resultsforUser[3] - 150;
                        var newvalueProduct = { $set: { price: newPrice } };
                        var newvalueStock = { $set: { "stock.p10": newStock, balance: newBalance, total: newTotal } };
                        db.collection('product').updateOne({ "name": "Yeezy slides" }, newvalueProduct, function (err, result) {
                            if (err) throw err;
                        });
                        db.collection('users').updateOne({ "name": currentuser }, newvalueStock, function (err, result) {
                            if (err) throw err;
                            console.log('user stock updated');
                        });
                        db.collection('users').findOne({ "name": currentuser }, function (err, result) {
                            if (err) throw err;
                            //console.log(result);
                            db.collection('product').find().toArray(function (err, presult) {
                                res.render('pages/shop', {
                                    user: result,
                                    productarray: presult
                                })

                            })
                        });
                    } else { //they can't sell what they don't have
                        res.render('pages/failsell');
                    }

                })

            });
        }
    });

})

app.post('/start', function (req, res) {
    console.log("start");
    db.collection('users').updateOne({ "name": "admin" }, {
        $set: { start: 1 }, function(err, result) {
            if (err) throw err;
            req.session.currentuser = uname;
            res.redirect('/admin')
        }
    });
})

app.post('/stop', function (req, res) {
    console.log("start");
    db.collection('users').updateOne({ "name": "admin" }, {
        $set: { start: 0 }, function(err, result) {
            if (err) throw err;
            console.log("stop")
            req.session.currentuser = uname;
            res.redirect('/admin')

        }
    });
})

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('purchase product1', function (price) {
        io.emit('purchase product1',price);
        console.log("new purchase price = " + price);
    });       


});

http.listen(8080, function () {
    console.log('listening on *:8080');
});

