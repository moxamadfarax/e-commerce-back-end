const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// Router to get all tags.
router.get("/", async (req, res) => {
  try {
    // find all tags with associated product data
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Router to get tag by id.
router.get("/:id", async (req, res) => {
  try {
    // find the tag by its id with associated product data
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: "Tag not found!" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Router to create a new tag.
router.post("/", async (req, res) => {
  try {
    // create a new tag with data from the request body
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Router to update tag by id.
router.put("/:id", async (req, res) => {
  try {
    // update the tag's name with data from the request body
    const tagData = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!tagData[0]) {
      res.status(404).json({ message: "Tag not found!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Router to delete tag by id.
router.delete("/:id", async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: "Tag not found!" });
      return;
    }
    res.status(200).json({ message: "Tag deleted." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
