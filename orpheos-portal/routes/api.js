const express = require("express");
const passport = require("passport");
const authMiddleWare = require("../middleware/authMiddleWare");
const router = express.Router();
const db = require("../db");

router.use(require("connect-ensure-login").ensureLoggedIn({ redirectTo: "/" }));

router.get("/", (req, res, next) => {
  return res.redirect("/status/404");
});

router.get("/memes", (req, res, next) => {
  return res.json({
    response: "memes"
  });
});

router.get("/categories", async (req, res, next) => {
  const start = req.query.start || 0;
  const limit = req.query.limit || 50;
  const end = start + limit;
  const categories = await db.category.loadCategories(start, end);

  return res.json(categories);
});

module.exports = router;
