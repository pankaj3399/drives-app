const cron = require("node-cron");
const DriveModel = require("../models/drive");
const HardDriveDeletionStatusEnum = require("../models/enum");
const { updateScan, getAllScansSpecificOrder } = require("../services/scan");
const { updateOrder } = require("../services/order");

const scheduleCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("running a task every one minute");
    try {
      const drives = await DriveModel.find({
        processed: { $exists: false },
      });
      console.log("drives", drives);
      await Promise.all(
        drives.map(async (drive) => {
          console.log("inside");
          await DriveModel.findOneAndUpdate(
            { _id: drive._id },
            { $set: { processed: true } }
          );
          let fingerprint = drive?.report?.document?.[""]?.[0].data ?? null;
          const datetime = drive?.report?.document?.datetime ?? null;
          const erasureResults = drive?.report?.document["Erasure Results"];
          const arr = erasureResults?.length > 0 ? erasureResults[0] : [];
          const serialNumber = arr.length > 0 ? arr[0]["column 5"] : null;
          const statusColumn = erasureResults?.[0]?.[3] ?? null;
          const info = erasureResults[0]?.[2]?.["column 1"] ?? null;
          fingerprint = fingerprint?.split("Can")[0];
          console.log(
            statusColumn,
            serialNumber,
            info,
            datetime,
            fingerprint,
            "Updating"
          );
          if (serialNumber && statusColumn) {
            const status = statusColumn["column 1"]
              ?.toLowerCase()
              .includes("fail")
              ? HardDriveDeletionStatusEnum.FAILED_DELETION
              : HardDriveDeletionStatusEnum.DELETED;

            const scan = await updateScan(
              { serialNumber: serialNumber },
              {
                deletionStatus: status,
                deletionDate: new Date(),
                info: info,
                datetime: datetime ? new Date(datetime) : null,
                fingerprint: fingerprint,
              }
            );
            if (!scan) {
              return;
            }
            const scans = await getAllScansSpecificOrder(scan.orderId);
            let isCompleted = true;
            let drivesDeleted = 0;
            let failedDeletion = 0;
            for (const scan of scans) {
              if (
                scan.deletionStatus === HardDriveDeletionStatusEnum.NON_STARTED
              ) {
                isCompleted = false;
                break;
              }
              if (scan.deletionStatus === HardDriveDeletionStatusEnum.DELETED) {
                drivesDeleted += 1;
              }
              if (
                scan.deletionStatus ===
                HardDriveDeletionStatusEnum.FAILED_DELETION
              ) {
                failedDeletion += 1;
              }
            }
            if (isCompleted) {
              await updateOrder(
                { _id: scan.orderId },
                { completionDate: new Date() }
              );
            }
          }
        })
      );
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = scheduleCron;
