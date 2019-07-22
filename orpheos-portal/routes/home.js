const express = require("express");
const passport = require("passport");
const authMiddleWare = require("../middleware/authMiddleWare");
const router = express.Router();
const db = require("../db");
const MenuService = require("../services/menuService");

// Define routes.
router.get(
  "/",
  function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    // console.log(req);
    if (req.user) {
      res.redirect("/home");
    } else {
      return next();
    }
  },
  (req, res) => {
    res.render("index", { user: req.user });
  }
);

router.get("/test", function(req, res) {
  if (!req.user) res.redirect("/");
  res.json(req.user);
});

// router.get('/login', (req, res) => {
//     res.render('login');
// });

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/home");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/home",
  authMiddleWare.redirectNonAuthorized("/"),
  async (req, res) => {
    let menu = [];
    try {
      menu = await MenuService.createHomeScreenMenu(req.user);
    } catch (ex) {
      console.log(ex);
    }

    res.render("home", { user: req.user, sidebar: menu });
  }
);

router.get(
  "/home/projects",
  authMiddleWare.redirectNonAuthorized("/"),
  async (req, res) => {
    let menu = [];
    let projects = [];
    try {
      menu = await MenuService.createHomeScreenMenu(req.user);
      projects = await db.project.getAllProjects(0, 100);
    } catch (ex) {
      console.log(ex);
    }

    res.render("home", {
      user: req.user,
      sidebar: menu,
      view: "../partials/homeProject.ejs",
      data: { projects: projects }
    });
  }
);

module.exports = router;
