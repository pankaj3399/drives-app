const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    report: {
      type: Object,
    },
    processed: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
  }
);

const DriveModel = mongoose.model("drive", driveSchema);
module.exports = DriveModel;
