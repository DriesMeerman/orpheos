const express = require('express');
const passport = require('passport');
const authMiddleWare = require('../middleware/authMiddleWare');
// const User = require('../model/User');
const router = express.Router();

// Define routes.
router.get('/', function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    // console.log(req);
    if (req.user) {
        res.redirect('/home');
    } else {
        return next();
    }
},
    (req, res) => {
        // function (req, res) {
        res.render('index', { user: req.user });
    });

router.get('/home', authMiddleWare.redirectNonAuthorized('/'),
    (req, res) => {
        res.render('home', { user: req.user });
    });

router.get('/test', function (req, res) {
    if (!req.user) res.redirect('/');
    res.json(req.user);
});

// router.get('/login', (req, res) => {
//     res.render('login');
// });

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/home');
    });

router.get('/logout',
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

module.exports = router;