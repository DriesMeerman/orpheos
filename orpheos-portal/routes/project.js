const express = require('express');
const Project = require('../model/Project');
const db = require('../db');
const CONSTANTS = require('../config/constants');
const auth = require('../middleware/authMiddleWare');
const router = express.Router();

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
    try {
        let projects = await db.project.findProjectsByCategory(category);
        return res.json(projects);
    } catch (ex) {
        return res.json(ex);
    }
});

router.get('/user/:id', async (req, res) => {
    let user = req.params.id;
    try {
        let projects = await db.project.findProjectsByOwner(user);
        return res.json(projects);
    } catch (ex) {
        return res.json(ex);
    }
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