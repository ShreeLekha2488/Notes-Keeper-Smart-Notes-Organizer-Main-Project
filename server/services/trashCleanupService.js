const Note = require("../models/Note");

// Delete notes that have been in trash for more than 30 days
const cleanupTrash = async () => {
  try {
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Note.deleteMany({
      isTrashed: true,
      trashedAt: {
        $lte: thirtyDaysAgo,
      },
    });

    console.log(
      `🗑️ Trash Cleanup: ${result.deletedCount} note(s) deleted`
    );
  } catch (error) {
    console.error("Trash Cleanup Error:", error.message);
  }
};

module.exports = cleanupTrash;