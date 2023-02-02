const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// Route to retrieve all products with associated product tags, tags, and categories.
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: ProductTag }, { model: Tag }, { model: Category }],
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Route to get a product by it's id.
router.get("/:id", (req, res) => {
  Product.findOne({
    include: [{ model: ProductTag }, { model: Tag }, { model: Category }],
    where: { id: req.params.id },
  })
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${req.params.id} not found. Please try again with another id.`,
        });
      }
      res.json(product);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// Route to create a new product.
router.post("/", (req, res) => {
  if (!req.body.product_name || !req.body.price) {
    return res
      .status(400)
      .json({ message: "Both product_name and price are required fields." });
  }
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock || 0,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds || [],
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagAssociations = req.body.tagIds.map((tag_id) => ({
          product_id: product.id,
          tag_id,
        }));
        return ProductTag.bulkCreate(productTagAssociations);
      }
      return res.status(201).json(product);
    })
    .then((productTagIds) => {
      res.status(201).json(productTagIds);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// Route to update a product by it's id.
router.put("/:id", (req, res) => {});

// Route to delete product by it's id.
router.delete("/:id", (req, res) => {});

module.exports = router;
