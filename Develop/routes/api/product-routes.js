const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// Route to retrieve all products with associated product tags, tags, and categories.
router.get("/", async (req, res) => {});

// Route to get a product by it's id.
router.get("/:id", (req, res) => {});

// Route to create a new product.
router.post("/", (req, res) => {});

// Route to update a product by it's id.
router.put("/:id", (req, res) => {});

// Route to delete product by it's id.
router.delete("/:id", (req, res) => {});

module.exports = router;
