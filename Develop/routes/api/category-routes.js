const express = require("express");
const router = express.Router();
const { Category, Product } = require("../../models");

// Getting all categories.
router.get("/", (req, res) => {
  Category.findAll({
    include: [{ model: Product }],
  })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

// Route to get a category by it's ID.
router.get("/:id", (req, res) => {});

// Route to create a  new category.
router.post("/", (req, res) => {});

// Route to update a category by it's ID
router.put("/:id", (req, res) => {});

// Route to delete a category by it's ID
router.delete("/:id", (req, res) => {});

module.exports = router;
