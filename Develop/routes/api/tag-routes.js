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
router.post("/", (req, res) => {
  // Validation that the tag_name was passed in the body and if not will notify user.
  if (req.body.tag_name === undefined) {
    res.status(404).json({
      message: `Could not find requested tag name. Please try again.`,
    });
    return;
  }
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((newTag) => {
      res.json(newTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Route to update tag by it's id.
router.put("/:id", (req, res) => {
  if (req.body.tag_name === undefined) {
    res.status(404).json({
      message: `Could not find requested tag name. Please try again.`,
    });
    return;
  }
  Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedTag) => {
      if (updatedTag == 0) {
        res.status(404).json({
          message: `No records were modified with this put request for id ${req.params.id}. Please check your id, and updated name and try again!`,
        });
        return;
      }
      res.json({ message: "Tag Name has been updated" });
    })
    .catch((err) => res.json(err));
});

// Route to delete tag by it's id.
router.delete("/:id", (req, res) => {
  Tag.destroy({
    where: { id: req.params.id },
  })
    .then((deletedTag) => {
      if (deletedTag === 0) {
        res.status(404).json({
          message: `Could not delete row with id of : ${req.params.id}. Please check your Tag ID and try again!`,
        });
        return;
      }
      res.json({
        message: `${deletedTag} has been successfuly deleted.`,
      });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
