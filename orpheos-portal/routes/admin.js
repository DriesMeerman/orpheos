const express = require('express');
const User = require('../model/User');
const router = express.Router();
const CONSTANTS = require('../config/constants');
const auth = require('../middleware/authMiddleWare');
const db = require('../db');

router.use(require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }));
router.use(auth.accessRedirect(CONSTANTS.roles.ADMIN, '/status/403'));

router.get('/',
    require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }),
    function (req, res) {
        res.render('admin', { user: req.user });
    });

router.get('/users',
    function (req, res) {
        let page = req.query.page || 0;
        let count = 25;
        db.users.loadUsers(count * page, count, (err, users) => {
            if (err) {
                res.render('admin-user', { user: req.user, page: page });
                return;
            }
            users = users.map (user => {
                user.accessLevel = CONSTANTS.roles_lookup[user.accessLevel].name;
                return user;
            });
            res.render('admin-user', { user: req.user, page: page, users: users });
        })
        // .catch((err) => {
        //     res.render('admin-user', { user: req.user, page: page });
        // })
    });

router.delete('/users/:id',
    (req, res) => {
        let id = req.params.id;
        db.users.removeUserById(id, (err, result) => {
            if (err) {
                res.json(err);
            } else {
                let result = {
                    success: true
                };
                result = JSON.stringify(result);
                res.json(result);
            }
        })
    });

router.get('/users/new',
    function (req, res) {
        let accessLevels = Object.keys(CONSTANTS.roles).map( roleKey =>  CONSTANTS.roles[roleKey] );
        res.render('admin-user-new', { user: req.user, accessLevels: accessLevels });
    });

router.post('/users/new',
    (req, res) => {
        let body = req.body;
        console.log('Creating new user from body:', body);
        let data = {
            username: body.username,
            display_name: body.display_name,
            password: body.password,
            access_level: body.access
        }
        console.log('Adding new user', data.display_name);
        let user = new User(data, true);

        db.users.insertUser(user, (err, response) => {
            if (err) {
                res.json(err);
            } else {
                res.redirect('/admin/users');
            }
        });
    });

module.exports = router;