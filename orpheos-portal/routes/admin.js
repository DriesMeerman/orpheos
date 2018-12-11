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
            users = users.map(user => {
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
        let accessLevels = _getAccessLevels(req.user.accessLevel);
        res.render('admin-user-change', {
            user: req.user,
            accessLevels: accessLevels,
            view: CONSTANTS.view_types.user.NEW,
            endUser: {}
        });
    });

router.post('/users/new',
    (req, res) => {
        let body = req.body;
        console.log('Creating new user from body:', body);
        let role = CONSTANTS.roles[body.access];
        let access = role ? role.value : 0;
        let data = {
            username: body.username,
            display_name: body.display_name,
            password: body.password,
            access_level: access
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

router.get('/users/edit/:id',
    async function (req, res) {
        let accessLevels = _getAccessLevels(req.user.accessLevel);
        let id = req.params.id;
        console.log("ID", id);

        db.users.findById(id, (error, endUser) => {
            if (error) return res.json(error);

            delete endUser.password;
            console.log('meemuser', endUser);
            return res.render('admin-user-change', {
                user: req.user,
                accessLevels: accessLevels,
                view: CONSTANTS.view_types.user.UPDATE,
                endUser: endUser
            });
        });

    });

    router.post('/users/edit/:id',
    (req, res) => {
        let currentUserAccess = req.user.accessLevel;
        let body = req.body;
        console.log('Updating user from body:', body);
        let role = CONSTANTS.roles[body.access];
        let access = role ? role.value : 0;

        if (access > currentUserAccess){
            access = currentUserAccess;
        }

        let data = {
            id: body.id,
            display_name: body.display_name,
            access_level: access
        }



        if (body.password && body.password != ''){
            console.log('hoeren jong', body.password);
            data.password = User.hashPassword(body.password);
        }
        console.log('Updating new user', data);

        let user = new User(data);

        db.users.findById(user.id, (error, dbUser) => {
            if (error) return res.json(err);
            if (dbUser.accessLevel > currentUserAccess) {
                return res.redirect(403, '/status/403');
            }
            db.users.updateUser(user, (err, result) => {
                if (err) return res.json(err);
                res.redirect('/admin/users');//render('profile', { user: req.user }); 
            })
        });

        // db.users.updateUser(user, (err, response) => {
        //     if (err) {
        //         res.json(err);
        //     } else {
        //         res.redirect('/admin/users');
        //     }
        // });
    });

function _getAccessLevels(accessLevel) {
    accessLevel = accessLevel ? accessLevel : 0;
    let roles = Object.keys(CONSTANTS.roles).map(roleKey => CONSTANTS.roles[roleKey]);
    roles = roles.filter(rol => rol.value <= accessLevel);
    console.log('get roles', roles);
    return roles;
}

module.exports = router;