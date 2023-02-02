const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// Route to get all tags.
router.get("/", (req, res) => {
  Tag.findAll({
    include: [{ model: ProductTag }, { model: Product }],
  }).then((data) => {
    res.json(data);
  });
});

// Route to return tag by it's id.
router.get("/:id", (req, res) => {});

// Route to create a new tag.
router.post("/", (req, res) => {});

// Route to update tag by it's id.
router.put("/:id", (req, res) => {});

// Route to delete tag by it's id.
router.delete("/:id", (req, res) => {});

module.exports = router;
