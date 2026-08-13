const Tag = require("../models/Tag");

/* ==========================================================
   GET ALL TAGS
   GET /api/tags
========================================================== */

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({
      user: req.user._id,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error("Get Tags Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load tags",
    });
  }
};

/* ==========================================================
   CREATE TAG
   POST /api/tags
========================================================== */

const createTag = async (req, res) => {
  try {
    let { name, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    name = name.trim();

    const existingTag = await Tag.findOne({
      name,
      user: req.user._id,
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists",
      });
    }

    const tag = await Tag.create({
      name,
      color: color || "#3B82F6",
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      tag,
    });
  } catch (error) {
    console.error("Create Tag Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create tag",
    });
  }
};

/* ==========================================================
   UPDATE TAG
   PUT /api/tags/:id
========================================================== */

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, color } = req.body;

    const tag = await Tag.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    if (name && name.trim()) {
      name = name.trim();

      const duplicate = await Tag.findOne({
        name,
        user: req.user._id,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Another tag with this name already exists",
        });
      }

      tag.name = name;
    }

    if (color) {
      tag.color = color;
    }

    await tag.save();

    res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      tag,
    });
  } catch (error) {
    console.error("Update Tag Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update tag",
    });
  }
};

/* ==========================================================
   DELETE TAG
   DELETE /api/tags/:id
========================================================== */

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    await tag.deleteOne();

    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete Tag Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete tag",
    });
  }
};

module.exports = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
};