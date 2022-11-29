const express = require("express");
const router = new express.Router();
const items = require("./fakeDb");
const ExpressError = require("./error");

router.get("/", (req, res, next) => {
  try {
    return res.json(items);
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res, next) => {
  try {
    const item = items.find((item) => item.name === req.params.name);
    if (!item) throw new ExpressError("Item not found", 400);
    return res.json(item);
  } catch (e) {
    return next(e);
  }
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price)
      throw new ExpressError("No item posted", 400);
    const item = req.body;
    items.push(item);
    return res.status(201).json({ added: item });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    const item = items.find((item) => item.name === req.params.name);
    if (!item) throw new ExpressError("Item not found", 404);
    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;
    return res.json({ updated: item });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  try {
    const itemIdx = items.findIndex((item) => item.name === req.params.name);
    if (itemIdx === -1) throw new ExpressError("Item not found", 404);
    items.splice(itemIdx, 1);
    return res.json({ message: "deleted" });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
