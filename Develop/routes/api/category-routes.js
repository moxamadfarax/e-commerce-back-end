const express = require("express");
const router = express.Router();
const { Category, Product } = require("../../models");

// Get all categories
router.get("/", (req, res) => {
  Category.findAll({
    include: [{ model: Product }],
  })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

// Get category by ID
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

// Create a new category
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

// Update a category by ID
router.put("/:id", (req, res) => {
  if (!req.body.category_name) {
    return res
      .status(404)
      .json({ message: "No category name found in the request body" });
  }
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ message: `No category found with ID ${req.params.id}` });
      }
      res.json({ message: "Category updated successfully" });
    })
    .catch((err) => res.json(err));
});

// Delete a category by ID
router.delete("/:id", (req, res) => {
  Category.destroy({
    where: { id: req.params.id },
  })
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res
          .status(404)
          .json({ message: `No category found with ID ${req.params.id}` });
      }
      res.json({ message: `Category with ID ${req.params.id} deleted` });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
