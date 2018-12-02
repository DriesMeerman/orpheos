var express = require('express');
var passport = require('passport');
const path = require('path');
const bcrypt = require("bcryptjs");
var Strategy = require('passport-local').Strategy;
var db = require('./db');

const User = require('./model/User');
const PassportStrategyHelper = require('./services/passportStrategyHelper')


const PORT = 3000;

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(PassportStrategyHelper.verifyLocalUser));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});




// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//add dependencies
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/assets', express.static(path.resolve() + '/assets/'));

// express.static(path.resolve() + '/assets/')

// app.use('/node_modules', express.static(path.resolve()+'/node_modules')); //bad
addDependency('bootstrap', 'dist');
addDependency('jquery', 'dist');
addDependency('tether', 'dist');


// // Define routes.

app.use('/', require('./routes/home'));
app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));

process.on('unhandledRejection', console.log.bind(console))


setTimeout(letsGo, 5 * 1000);

function letsGo(){
    console.log('letsago');
    setupDatabase();
    //dbTestThing();
    app.listen(PORT);
}

function dbTestThing(){
    db.users.findById('1', (err,res) => {
        console.log('RAW USER DATA FROM DB', res);
        let user = new User(res);
        console.log('user', user);
    });
    db.users.findByUsername('admin', (err,res) => {
        console.log('RAW USER DATA FROM DB BY NAME', res);
        let user = new User(res);
        console.log('user', user);
    });
    let dries = new User({ id: 3, username: 'dries', password: 'yeet', displayName: 'Dries' }, true);
    db.users.insertUser(dries, (result)=>{
        console.log('inserted user', result);
    });
}

// setupDatabase();
// app.listen(PORT);

function addDependency(name, dist) {
    dist = dist ? name + "/" + dist : name;
    console.log('adding dep', path.resolve() + '/node_modules/' + dist);
    app.use('/dep/' + name, express.static(path.resolve() + '/node_modules/' + dist));
}

/**
 * temp db setup
 */
function setupDatabase() {
    const db = require('./db/connection')

    var handelDbIssue = (err) => {
        //console.log('Error: ', err);
        console.log('Running db setup')
        var promises = continueSetup(db);
        Promise.all(promises).then((values)=>{
            console.log('done insertion', values);
        })
    }

    db_exist_query(db).then((res) => {

        db_userTableExists_query(db).then((result)=>{
            console.log('db already exists skipping..');
        }).catch(handelDbIssue)

        
    }).catch(handelDbIssue)

    function continueSetup(db){
        let createDBQuery = "CREATE DATABASE `orpheos`;";
        let createUserTableQuery = "CREATE TABLE `orpheos`.`user` ( `id` INT NOT NULL AUTO_INCREMENT ,`display_name` VARCHAR(20) NOT NULL , `user_name` VARCHAR(20) NOT NULL , `password` VARCHAR(60) NOT NULL , PRIMARY KEY (`id`), UNIQUE (`user_name`));";
        let insertUserQuery = "INSERT INTO `user` (`id`, `display_name`, `user_name`, `password`) VALUES (NULL, 'Admin', 'admin', '$2a$12$UqaXAflkcYz7wPxqnpp6HublPKx5Lopy6WP841.pc98yKxOaBIdt6');";
    
        let queries = [createDBQuery, createUserTableQuery, insertUserQuery];
        var promises = [];
    
        queries.forEach((query) => {
            promises.push(new Promise(function (resolve, reject) {
                db.pool.getConnection((err, con) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("inserting " + query);

                    con.query(query, null, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                        con.release();
                    });
    
                });
            }));
        });
        return promises;
    }


    
}

function db_userTableExists_query(db){
    let que = `SELECT * FROM orpheos.user WHERE id = 1;`;
    return new Promise(function (resolve, reject) {
        db.pool.getConnection((err, con) => {
            console.log('hi', arguments);
            if (err) {
                reject(err);
                return;
            }
            if (!con) {
                reject(arguments);
                return;
            }

            con.query(que, null, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                con.release();
            });

        });
    });
}

function db_exist_query(db){
    let que = `SHOW DATABASES LIKE 'orpheos';`;
    return new Promise(function (resolve, reject) {
        db.pool.getConnection((err, con) => {
            console.log('hi', arguments);
            if (err) {
                reject(err);
                return;
            }
            if (!con) {
                reject(arguments);
                return;
            }

            con.query(que, null, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                con.release();
            });

        });
    });
}