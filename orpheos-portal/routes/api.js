const express = require("express");
const router = express.Router();
const db = require("../db");

router.use(require("connect-ensure-login").ensureLoggedIn({ redirectTo: "/" }));

router.get("/", (req, res, next) => {
  return res.redirect("/status/404");
});

router.get("/categories", async (req, res, next) => {
  const start = req.query.start || 0;
  const limit = req.query.limit || 50;
  const end = start + limit;
  const categories = await db.category.loadCategories(start, end);

  return res.json(categories);
});

module.exports = router;
