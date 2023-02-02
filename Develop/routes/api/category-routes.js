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
router.get("/:id", (req, res) => {
  Category.findAll({
    include: [{ model: Product }],
    where: { id: req.params.id },
  })
    .then((data) => {
      if (!data.length) {
        return res
          .status(404)
          .json({ message: `No category found with ID ${req.params.id}` });
      }
      res.json(data);
    })
    .catch((err) => res.json(err));
});

// Route to create a  new category.
router.post("/", (req, res) => {
  if (!req.body.category_name) {
    return res
      .status(404)
      .json({ message: "No category name found in the request body" });
  }
  Category.create({
    category_name: req.body.category_name,
  })
    .then((newCategory) => res.json(newCategory))
    .catch((err) => res.json(err));
});

// Route to update a category by it's ID
router.put("/:id", (req, res) => {});

// Route to delete a category by it's ID
router.delete("/:id", (req, res) => {});

module.exports = router;
