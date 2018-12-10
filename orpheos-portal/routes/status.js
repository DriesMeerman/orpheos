const express = require('express');
const passport = require('passport');
const User = require('../model/User');
var db = require('../db');

const router = express.Router();



router.get('/',
    (req, res) => {
        res.redirect('/');
    });

router.get('/403', (req, res) => {
    res.status(403);
    res.json("not allowed go away");
})


module.exports = router;