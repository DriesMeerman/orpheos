const express = require('express');
const passport = require('passport');
const User = require('../model/user');
const router = express.Router();


router.get('/',
    require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }),
    function (req, res) {
        res.render('admin', { user: req.user });
    });

router.get('/users',
    require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }),
    function (req, res) {
        res.render('admin-user', { user: req.user });
    });

module.exports = router;