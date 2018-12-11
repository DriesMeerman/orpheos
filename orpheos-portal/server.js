const express = require('express');
const passport = require('passport');
const path = require('path');
const bcrypt = require("bcryptjs");
const Strategy = require('passport-local').Strategy;
const db = require('./db');
const dbHelper = require('./services/databaseSetupService');
const CONSTANTS = require('./config/constants');

const User = require('./model/User');
const PassportStrategyHelper = require('./services/passportStrategyHelper');

const enableLogging = process.env.enableLogging || false;


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
if (enableLogging){
    app.use(require('morgan')('combined'));
}

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

app.use(require('./middleware/navbarHelper').addNavitemsToLocals);

app.use('/', require('./routes/home'));
app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));
app.use('/status', require('./routes/status'))

process.on('unhandledRejection', console.log.bind(console))


// setTimeout(letsGo, 5 * 1000);

async function init(){
    try {
        let res = await dbHelper.validateDatabase();
        if (enableLogging) console.log('Database is valid', res);

        app.listen(PORT);
    } catch (ex) {
        try {
            let res = await dbHelper.validateDatabase();
            if (enableLogging) console.log('Database is valid', res);
    
            app.listen(PORT);
        } catch (ex) {
            console.log('Error validating database');
            process.exit(CONSTANTS.exit_codes.DB_FAILURE);
        }
    }
};

init();

// function letsGo(){
//     console.log('letsago');
//     setupDatabase();
//     //dbTestThing();
// }


// setupDatabase();
// app.listen(PORT);

function addDependency(name, dist) {
    dist = dist ? name + "/" + dist : name;
    console.log('adding dep', path.resolve() + '/node_modules/' + dist);
    app.use('/dep/' + name, express.static(path.resolve() + '/node_modules/' + dist));
}
