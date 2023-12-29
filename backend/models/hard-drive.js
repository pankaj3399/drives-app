const mongoose = require("mongoose");
const HardDriveDeletionStatusEnum = require("./enum");

const HardDriveSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    serialNumber: {
      type: String,
      required: true,
      index: true,
    },
    deletionStatus: {
      type: String,
      enum: HardDriveDeletionStatusEnum,
      default: HardDriveDeletionStatusEnum.NON_STARTED,
    },
    deletionDate: Date,
    info: String,
    datetime: String,
    fingerprint: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

const HardDriveModel = mongoose.model("hard-drive", HardDriveSchema);
module.exports = HardDriveModel;
