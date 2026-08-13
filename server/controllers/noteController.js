const Note = require("../models/Note");

const Folder = require("../models/Folder");
const Tag = require("../models/Tag");

const NoteVersion = require("../models/NoteVersion");

const Notification = require("../models/Notification");

/* ===================================================
   Create Note
=================================================== */

const createNote = async (req, res) => {
  try {
    const {
      title,
      content,
      folder,
      tags,
      color,
      favorite,
      pinned,
      archived,
      isFavorite,
      isPinned,
      isArchived,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and Content are required",
      });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      folder: folder || null,
      tags: tags || [],
      color: color || "#ffffff",

      isFavorite:
        favorite !== undefined
          ? favorite
          : isFavorite || false,

      isPinned:
        pinned !== undefined
          ? pinned
          : isPinned || false,

      isArchived:
        archived !== undefined
          ? archived
          : isArchived || false,

      lastEdited: new Date(),
    });

    await Notification.create({
      user: req.user._id,
      title: "Note Created",
      message: `"${note.title}" was created successfully.`,
      type: "note_created",
      note: note._id,
    });

    res.status(201).json({
      success: true,
      message: "Note Created Successfully",
      note,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   Get All Notes
   Sorting + Pagination
========================================== */

const getAllNotes = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { sort } = req.query;

    let sortOption = {
      isPinned: -1,
      updatedAt: -1,
    };

    switch (sort) {

      case "newest":
        sortOption = { updatedAt: -1 };
        break;

      case "oldest":
        sortOption = { updatedAt: 1 };
        break;

      case "title":
        sortOption = { title: 1 };
        break;

      case "created":
        sortOption = { createdAt: -1 };
        break;

      case "pinned":
        sortOption = {
          isPinned: -1,
          updatedAt: -1,
        };
        break;

      default:
        sortOption = {
          isPinned: -1,
          updatedAt: -1,
        };
    }

    const totalNotes = await Note.countDocuments({
      user: req.user._id,
      isTrashed: false,
      isArchived: false,
    });

    const notes = await Note.find({
      user: req.user._id,
      isTrashed: false,
      isArchived: false,
    })
      .populate("folder")
      .populate("tags")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,

      currentPage: page,

      totalPages: Math.ceil(totalNotes / limit),

      totalNotes,

      hasNextPage: page < Math.ceil(totalNotes / limit),

      hasPreviousPage: page > 1,

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

/* ===================================================
   Get Single Note
=================================================== */

const getSingleNote = async (req, res) => {

  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("folder")
      .populate("tags");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ===================================================
   Update Note
=================================================== */

const updateNote = async (req, res) => {

  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    // Save current version before updating

    const versionCount = await NoteVersion.countDocuments({
      note: note._id,
    });

    await NoteVersion.create({
      note: note._id,
      user: note.user,

      title: note.title,
      content: note.content,

      folder: note.folder,
      tags: note.tags,

      color: note.color,

      isPinned: note.isPinned,
      isArchived: note.isArchived,
      isFavorite: note.isFavorite,

      versionNumber: versionCount + 1,
    });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.folder = req.body.folder || note.folder;
    note.tags = req.body.tags || note.tags;
    note.color = req.body.color || note.color;

    if (req.body.folder !== undefined) {
      note.folder = req.body.folder === "" ? null : req.body.folder;
    }

    if (req.body.favorite !== undefined) {
      note.isFavorite = req.body.favorite;
    }

    if (req.body.isFavorite !== undefined) {
      note.isFavorite = req.body.isFavorite;
    }

    if (req.body.pinned !== undefined) {
      note.isPinned = req.body.pinned;
    }

    if (req.body.isPinned !== undefined) {
      note.isPinned = req.body.isPinned;
    }

    if (req.body.archived !== undefined) {
      note.isArchived = req.body.archived;
    }

    if (req.body.isArchived !== undefined) {
      note.isArchived = req.body.isArchived;
    }

    note.lastEdited = new Date();

    await note.save();

    await Notification.create({
      user: req.user._id,
      title: "Note Updated",
      message: `"${note.title}" was updated.`,
      type: "note_updated",
      note: note._id,
    });

    res.status(200).json({
      success: true,
      message: "Note Updated Successfully",
      note,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// Get Note Version History

const getNoteVersions = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const versions = await NoteVersion.find({
      note: note._id,
    }).sort({ versionNumber: -1 });

    res.status(200).json({
      success: true,
      count: versions.length,
      versions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================================
   Delete Note
=================================================== */

const deleteNote = async (req, res) => {

  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: "Note Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

/* ==========================================
   Pin / Unpin Note
========================================== */

const togglePinNote = async (req, res) => {
  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    note.isPinned = !note.isPinned;
    note.lastEdited = new Date();

    await note.save();

    await Notification.create({
      user: req.user._id,
      title: note.isPinned ? "Note Pinned" : "Note Unpinned",
      message: note.isPinned
        ? `"${note.title}" was pinned.`
        : `"${note.title}" was unpinned.`,
      type: "pin",
      note: note._id,
    });

    res.status(200).json({
      success: true,
      message: note.isPinned
        ? "Note Pinned Successfully"
        : "Note Unpinned Successfully",
      note,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   Archive / Restore Note
========================================== */

const toggleArchiveNote = async (req, res) => {
  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    note.isArchived = !note.isArchived;
    note.lastEdited = new Date();

    await note.save();

    await Notification.create({
      user: req.user._id,
      title: note.isArchived
        ? "Note Archived"
        : "Note Restored",
      message: note.isArchived
        ? `"${note.title}" was archived.`
        : `"${note.title}" was restored.`,
      type: "archive",
      note: note._id,
    });

    res.status(200).json({
      success: true,
      message: note.isArchived
        ? "Note Archived Successfully"
        : "Note Restored Successfully",
      note,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   Move Note to Trash / Restore from Trash
========================================== */

const toggleTrashNote = async (req, res) => {
  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    if (note.isTrashed) {

      // Restore
      note.isTrashed = false;
      note.trashedAt = null;

    } else {

      // Move to Trash
      note.isTrashed = true;
      note.trashedAt = new Date();

    }

    note.lastEdited = new Date();

    await note.save();

    await Notification.create({
      user: req.user._id,
      title: note.isTrashed
        ? "Note Moved to Trash"
        : "Note Restored",
      message: note.isTrashed
        ? `"${note.title}" was moved to Trash.`
        : `"${note.title}" was restored.`,
      type: note.isTrashed ? "trash" : "restore",
      note: note._id,
    });

    res.status(200).json({
      success: true,
      message: note.isTrashed
        ? "Note Moved to Trash Successfully"
        : "Note Restored Successfully",
      note,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   Permanently Delete Note
========================================== */

const deleteForeverNote = async (req, res) => {
  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note Permanently Deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   Search Notes
========================================== */

const searchNotes = async (req, res) => {
  try {

    const keyword = req.query.keyword || "";

    const notes = await Note.find({
      user: req.user._id,
      isTrashed: false,
      isArchived: false,
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          content: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .populate("folder")
      .populate("tags")
      .sort({
        isPinned: -1,
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
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

/* ==========================================
   Get Archived Notes
========================================== */

const getArchivedNotes = async (req, res) => {
  try {

    const notes = await Note.find({
      user: req.user._id,
      isArchived: true,
      isTrashed: false,
    })
      .populate("folder")
      .populate("tags")
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
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

/* ==========================================
   Get Notes by Folder
========================================== */

const getNotesByFolder = async (req, res) => {
  try {

    const { folderId } = req.params;

    const notes = await Note.find({
      user: req.user._id,
      folder: folderId,
      isTrashed: false,
      isArchived: false,
    })
      .populate("folder")
      .populate("tags")
      .sort({
        isPinned: -1,
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
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

/* ==========================================
   Get Notes by Tag
========================================== */

const getNotesByTag = async (req, res) => {
  try {

    const { tagId } = req.params;

    const notes = await Note.find({
      user: req.user._id,
      tags: tagId,
      isTrashed: false,
      isArchived: false,
    })
      .populate("folder")
      .populate("tags")
      .sort({
        isPinned: -1,
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
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

/* ==========================================
   Get Recent Notes
========================================== */

const getRecentNotes = async (req, res) => {
  try {

    const notes = await Note.find({
      user: req.user._id,
      isTrashed: false,
      isArchived: false,
    })
      .populate("folder")
      .populate("tags")
      .sort({
        updatedAt: -1,
      })
      .limit(10);

    res.status(200).json({
      success: true,
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

/* ==========================================
   Favorite / Unfavorite Note
========================================== */

const toggleFavoriteNote = async (req, res) => {
  try {

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note Not Found",
      });
    }

    note.isFavorite = !note.isFavorite;
    note.lastEdited = new Date();

    await note.save();

    await Notification.create({
      user: req.user._id,
      title: note.isFavorite
        ? "Favorite Added"
        : "Favorite Removed",
      message: note.isFavorite
        ? `"${note.title}" was added to favorites.`
        : `"${note.title}" was removed from favorites.`,
      type: "favorite",
      note: note._id,
    });

    res.status(200).json({
      success: true,
      message: note.isFavorite
        ? "Note Added to Favorites"
        : "Note Removed from Favorites",
      note,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   Get Favorite Notes
========================================== */

const getFavoriteNotes = async (req, res) => {
  try {

    const notes = await Note.find({
      user: req.user._id,
      isFavorite: true,
      isTrashed: false,
      isArchived: false,
    })
      .populate("folder")
      .populate("tags")
      .sort({
        isPinned: -1,
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
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

/* ==========================================
   Bulk Archive Notes
========================================== */

const bulkArchiveNotes = async (req, res) => {
  try {

    const { noteIds } = req.body;


    if (!noteIds || noteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select notes",
      });
    }


    await Note.updateMany(
      {
        _id: {
          $in: noteIds,
        },
        user: req.user._id,
      },
      {
        $set: {
          isArchived: true,
          updatedAt: new Date(),
        },
      }
    );


    res.status(200).json({
      success: true,
      message: "Notes Archived Successfully",
    });


  } catch (error) {


    res.status(500).json({
      success: false,
      message: error.message,
    });


  }
};

/* ==========================================
   Bulk move notes to trash
========================================== */

const bulkMoveToTrash = async (req, res) => {

  try {

    const { noteIds } = req.body;


    if (!noteIds || noteIds.length === 0) {

      return res.status(400).json({
        message: "No notes selected"
      });

    }


    await Note.updateMany(
      {
        _id: {
          $in: noteIds
        },

        user: req.user._id
      },

      {
        $set: {
          isTrashed: true
        }
      }
    );


    res.status(200).json({

      success: true,

      message: "Notes moved to trash successfully"

    });


  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

// Get Trashed Notes

const getTrashedNotes = async (req, res) => {
  try {

    const notes = await Note.find({
      user: req.user._id,
      isTrashed: true,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
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

// Restore Note from Trash

const restoreNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.isTrashed = false;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note restored successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk Restore Notes

const bulkRestoreNotes = async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No notes selected",
      });
    }

    const result = await Note.updateMany(
      {
        _id: { $in: noteIds },
        user: req.user._id,
        isTrashed: true,
      },
      {
        $set: {
          isTrashed: false,
          trashedAt: null,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Notes restored successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Bulk Delete Forever

const bulkDeleteForever = async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No notes selected",
      });
    }

    const result = await Note.deleteMany({
      _id: { $in: noteIds },
      user: req.user._id,
      isTrashed: true,
    });

    res.status(200).json({
      success: true,
      message: "Notes deleted permanently",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Empty Trash

const emptyTrash = async (req, res) => {
  try {
    const result = await Note.deleteMany({
      user: req.user._id,
      isTrashed: true,
    });

    res.status(200).json({
      success: true,
      message: "Trash emptied successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Dashboard Statistics
// GET /api/notes/dashboard/stats
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({
      user: req.user._id,
      isTrashed: false,
      isArchived: false,
    });

    const totalFolders = await Folder.countDocuments({
      user: req.user._id,
    });

    const favoriteNotes = await Note.countDocuments({
      user: req.user._id,
      isFavorite: true,
      isTrashed: false,
    });

    const archivedNotes = await Note.countDocuments({
      user: req.user._id,
      isArchived: true,
      isTrashed: false,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalNotes,
        totalFolders,
        favoriteNotes,
        archivedNotes,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==========================================
   Get Pinned Notes
========================================== */

const getPinnedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      isPinned: true,
      isTrashed: false,
      isArchived: false,
    })
      .populate("folder")
      .populate("tags")
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });

  } catch (error) {
    console.error("Get Pinned Notes Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,

  togglePinNote,
  toggleArchiveNote,
  toggleTrashNote,
  restoreNote,
  deleteForeverNote,

  searchNotes,
  getArchivedNotes,
  getTrashedNotes,

  getNotesByFolder,
  getNotesByTag,

  getDashboardStats,
  getRecentNotes,

  toggleFavoriteNote,
  getFavoriteNotes,
  getPinnedNotes,

  bulkArchiveNotes,
  bulkMoveToTrash,
  bulkRestoreNotes,
  bulkDeleteForever,

  emptyTrash,

  // Version History
  getNoteVersions,
};