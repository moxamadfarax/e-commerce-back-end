const express = require("express");
const router = express.Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// Router to get all produts.
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [Category, Tag],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Router to get product by id.
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });
    if (!productData) {
      return res.status(404).json({ message: "No product found!" });
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Router to create new product.
router.post("/", async (req, res) => {
  // Check if required fields are present in the request body
  if (!req.body.product_name || !req.body.price) {
    res.status(404).json({
      message: `Both product_name and price are required fields. Please revise the body and try again!`,
    });
    return;
  }

  try {
    // Create a new product
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tagIds: req.body.tagIds,
    });

    // If there are product tags, create pairings for bulk creation in ProductTag
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Send response with created product
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "An error occurred while creating the product",
    });
  }
});

// Router to update product by id.
router.put("/:id", async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const productTags = await ProductTag.findAll({
      where: { product_id: req.params.id },
    });
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => ({
        product_id: req.params.id,
        tag_id,
      }));
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
    res.status(200).json({ message: "Product updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating product", error: err });
  }
});

// Router to delete product by id.
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found!" });
      return;
    }
    res.status(200).json({ message: "Product removed." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
