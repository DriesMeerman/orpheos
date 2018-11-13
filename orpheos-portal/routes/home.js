const express = require('express');
const passport = require('passport');
// const User = require('../model/user');
const router = express.Router();

// Define routes.
router.get('/',
    function (req, res) {
        res.render('home', { user: req.user });
    });

router.get('/login',
    function (req, res) {
        res.render('login');
    });

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });

module.exports = router;