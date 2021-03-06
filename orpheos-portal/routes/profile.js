const express = require('express');
const passport = require('passport');
const User = require('../model/User');
var db = require('../db');

const router = express.Router();

router.use(require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }));

router.get('/',
    function (req, res) {
        res.render('profile', { user: req.user });
    });

router.post('/',
    (req, res) => {
        let body = req.body;

        let user = req.user;
        let updateUser = new User({id: user.id, displayName: body.display_name, password: body.password}, true);

        

        db.users.updateUser(updateUser, (err, result) => {
            if (err) return res.json(err);
            res.redirect('/profile');//render('profile', { user: req.user }); 
        })

        // res.redirect('/profile');//render('profile', { user: req.user });
    });

module.exports = router;