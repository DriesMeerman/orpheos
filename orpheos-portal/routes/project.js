const express = require('express');
const Project = require('../model/Project');
const db = require('../db');
const CONSTANTS = require('../config/constants');
const auth = require('../middleware/authMiddleWare');
const router = express.Router();
const MenuService = require('../services/menuService');

router.use(require('connect-ensure-login').ensureLoggedIn({ redirectTo: "/" }));
router.use(auth.accessRedirect(CONSTANTS.roles.NORMAL, '/status/403'));

router.get('/', async (req, res) => {
    if (req.query.search){
        let name = req.query.search;
        try {
            let projects = await db.project.findProjectByName(name);
            return res.json(projects);
        } catch (ex) {
            return res.json(ex);
        }
    }
    
    res.redirect('/project/all');
});


router.get('/id/:id', async (req, res) => {
    let id = req.params.id;
    if (!id){
        res.status(404);//redirect('')
    }
    let project = await db.project.getProjectById(id);
    return res.json(project);
});

router.get('/all', async (req, res) => {
    let pageSize = 100;
    let page = 0;
    try {
        if (req.query.page) page = parseInt(req.query.page);
        let projects = await db.project.getAllProjects(page * pageSize, (page+1) * pageSize);
        return res.json(projects);
    } catch (ex) {
        return res.json(ex);
    }
});

router.get('/category/:id', async (req, res) => {
    let category = req.params.id;

    let menu = [];
        let projects = [];
        try {
            menu = await MenuService.createHomeScreenMenu(req.user);
            projects = await await db.project.findProjectsByCategory(category);
        } catch (ex) {
            console.log(ex);
        }

        res.render('home', {
            user: req.user,
            sidebar: menu,
            view: "../partials/homeProject.ejs",
            data: { projects: projects }
        });
});

router.get('/user/:id', async (req, res) => {
    let user = req.params.id;
    try {
        menu = await MenuService.createHomeScreenMenu(req.user);
        projects = await db.project.findProjectsByOwner(user);
    } catch (ex) {
        console.log(ex);
    }

    res.render('home', {
        user: req.user,
        sidebar: menu,
        view: "../partials/homeProject.ejs",
        data: { projects: projects }
    });
});

router.post('/new', async (req, res) => {

    let payload = req.body;
    console.log('got payload', payload, req.body);
    payload.owner = req.user.id;
    let project = new Project(payload);
    try {
        let inserted = await db.project.insertProject(project);
        console.log('new project', inserted);
        res.redirect('/home');
    } catch (ex) {
        console.log(ex);
        res.json({someError: ex})
    }
    
})

module.exports = router;