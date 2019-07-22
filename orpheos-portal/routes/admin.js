const express = require('express');
const User = require('../model/User');
const Category = require('../model/Category')
const router = express.Router();
const CONSTANTS = require('../config/constants');
const auth = require('../middleware/authMiddleWare');
const db = require('../db');

router.use(require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }));
router.use(auth.accessRedirect(CONSTANTS.roles.ADMIN, '/status/403'));

router.get('/',
    require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }),
    function (req, res) {
        let isGod = CONSTANTS.roles.GOD.value === req.user.accessLevel;
        res.render('admin', { user: req.user, isGod:  isGod});
    });

router.get('/categories', async (req, res) => {
    let page = 0;
    let categories = [];
    try {
        categories = await db.category.loadCategories(0, 50);
    } catch (ex){
        console.warn("Error", ex);
    }
    
    return res.render('admin-category', {user: req.user, page: page, categories: categories})
});

router.get('/categories/new', (req, res) => {
    return res.render('admin-category-change', {
        user: req.user,
        view: CONSTANTS.view_types.category.NEW,
        category: {}
    });
});

router.post('/categories/new', async (req, res) => {
    let body = req.body;

    let payload = {
        name: body.name,
        description: body.description,
        parent: body.parent
    }

    let category = new Category(payload);
    try {
        await db.category.insertCategory(category);
    } catch (e){
        res.json(e);
    }

    return res.redirect('/admin/categories');
});

router.get('/adminquery',
    auth.accessRedirect(CONSTANTS.roles.GOD, '/status/403'),
    async (req, res) => {
        res.render('admin-query', {user: req.user});
    });

router.post('/adminquery',
    auth.accessRedirect(CONSTANTS.roles.GOD, '/status/403'),
    async (req, res) => {
        let query = req.body.query;
        if (!query){
            return res.json({error:"No query passed", body: req.body});
        }
        try {
            let result = await db.connection.executeQuery(query);
            let data = result.map(r => r);//mapped since pure row data doesn't want to be serialized;
            return res.render('admin-query', {user: req.user, result: data});
        } catch (ex){
            //console.log('ex', ex);
            //return res.json(ex);
            if (ex.toString) {
                ex = ex.toString();
            }

            return res.render('admin-query', {user: req.user, result: ex});
        }
});

router.delete('/categories/:id', async (req, res) => {
    let id = req.params.id;
    let result = "";
    try {
        result = await db.category.deleteCategory(id);
    } catch (ex) {
        return res.json(ex);
    }

    return res.json(result)
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

    });

function _getAccessLevels(accessLevel) {
    accessLevel = accessLevel ? accessLevel : 0;
    let roles = Object.keys(CONSTANTS.roles).map(roleKey => CONSTANTS.roles[roleKey]);
    roles = roles.filter(rol => rol.value <= accessLevel);
    console.log('get roles', roles);
    return roles;
}

module.exports = router;