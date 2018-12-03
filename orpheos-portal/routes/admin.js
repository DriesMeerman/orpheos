const express = require('express');
const passport = require('passport');
const User = require('../model/User');
const router = express.Router();
const db = require('../db');


router.get('/',
    require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }),
    function (req, res) {
        res.render('admin', { user: req.user });
    });

router.get('/users',
    require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }),
    function (req, res) {
        let page = req.query.page || 0;
        let count = 25;
        db.users.loadUsers(count * page, count, (err, users) => {
            if (err){
                res.render('admin-user', { user: req.user, page: page });
                return;
            } 
            res.render('admin-user', { user: req.user, page: page, users: users });
        })
        // .catch((err) => {
        //     res.render('admin-user', { user: req.user, page: page });
        // })
    });

router.get('/users/new',
    require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }),
    function (req, res) {
        res.render('admin-user-new', { user: req.user });
    });

router.post('/users/new',
    (req, res) => {
        console.log('ye', req.body);

        let body = req.body;
        let data = {
            username: body.username,
            display_name: body.display_name,
            password: body.password
        }
        let user = new User(data, true);

        db.users.insertUser(user);
        res.redirect('/admin/users/new');
    });

module.exports = router;