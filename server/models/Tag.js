const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      default: "#3B82F6",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same tag name can exist for different users,
// but one user cannot create the same tag twice.
tagSchema.index(
  { name: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model("Tag", tagSchema);