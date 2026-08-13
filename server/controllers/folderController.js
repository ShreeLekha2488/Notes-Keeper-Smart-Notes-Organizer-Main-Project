const Folder = require("../models/Folder");
const Note = require("../models/Note");


// ==========================================
// Get All Folders
// GET /api/folders
// ==========================================

const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find({
      user: req.user._id,
    }).sort({ createdAt: 1 });

    const foldersWithCount = await Promise.all(
      folders.map(async (folder) => {
        const noteCount = await Note.countDocuments({
          folder: folder._id,
          user: req.user._id,
          isTrashed: false,
        });

        return {
          ...folder.toObject(),
          noteCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: foldersWithCount.length,
      folders: foldersWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Single Folder
// GET /api/folders/:id
// ==========================================

const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const noteCount = await Note.countDocuments({
      folder: folder._id,
      user: req.user._id,
      isTrashed: false,
    });

    res.status(200).json({
      success: true,
      folder: {
        ...folder.toObject(),
        noteCount,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Update Folder
// PUT /api/folders/:id
// ==========================================

const updateFolder = async (req, res) => {
  try {
    const {
      name,
      color,
      icon,
      description,
    } = req.body;

    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Prevent duplicate folder names
    if (
      name &&
      name.trim() !== folder.name
    ) {
      const existingFolder = await Folder.findOne({
        user: req.user._id,
        name: name.trim(),
        _id: { $ne: folder._id },
      });

      if (existingFolder) {
        return res.status(400).json({
          success: false,
          message: "Folder name already exists",
        });
      }
    }

    folder.name = name?.trim() || folder.name;
    folder.color = color || folder.color;
    folder.icon = icon || folder.icon;
    folder.description =
      description !== undefined
        ? description
        : folder.description;

    await folder.save();

    res.status(200).json({
      success: true,
      message: "Folder updated successfully",
      folder,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Delete Folder
// DELETE /api/folders/:id
// ==========================================

const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Move all notes to "No Folder"
    const result = await Note.updateMany(
      {
        folder: folder._id,
        user: req.user._id,
      },
      {
        $set: {
          folder: null,
        },
      }
    );

    await folder.deleteOne();

    res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
      affectedNotes: result.modifiedCount,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get Notes By Folder
// GET /api/folders/:id/notes
// ==========================================

const getFolderNotes = async (req, res) => {
  try {
    // Check folder ownership
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const notes = await Note.find({
      folder: folder._id,
      user: req.user._id,
      isTrashed: false,
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      folder: {
        _id: folder._id,
        name: folder.name,
        color: folder.color,
        icon: folder.icon,
      },
      count: notes.length,
      notes,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Create Folder
// POST /api/folders
// ==========================================

const createFolder = async (req, res) => {
  try {
    const {
      name,
      color,
      icon,
      description,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    // Check duplicate folder
    const existingFolder = await Folder.findOne({
      user: req.user._id,
      name: name.trim(),
    });

    if (existingFolder) {
      return res.status(400).json({
        success: false,
        message: "Folder already exists",
      });
    }

    const folder = await Folder.create({
      name: name.trim(),
      color,
      icon,
      description,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folder,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
  getFolderNotes,
};