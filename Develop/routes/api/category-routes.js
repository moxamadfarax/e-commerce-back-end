const router = require("express").Router();
const { Category, Product, Tag } = require("../../models");

// Router to create all categories.
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving categories", error: err });
  }
});

// Router to get a category by id.
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving category", error: err });
  }
});

// Router to create a new category.
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: "Error creating category", error: err });
  }
});

// Router to update category by id.
router.put("/:id", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Request body is missing" });
      return;
    }
    // Perform additional validation if necessary
    if (!req.body.category_name) {
      res.status(400).json({ message: "category_name is required" });
      return;
    }
    const [updatedRows, updatedCategory] = await Category.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (updatedRows === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json(updatedCategory[0]);
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err });
  }
});

// Router to delete category by id.
router.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err });
  }
});

module.exports = router;
