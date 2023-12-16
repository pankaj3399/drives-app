const { checkDeviceValidation } = require('../validations/customer');
const { getSingleOrder } = require('../services/order');
const { getScansCount, getAllScansSpecificOrder } = require('../services/scan');
const HardDriveDeletionStatusEnum = require('../models/enum');

async function checkDevice(req, res) {
    // Validate information
    const validation = checkDeviceValidation(req.body);
    if (validation.error) {
        return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }
    const { orderId, authCode } = req.body;

    const order = await getSingleOrder({ _id: orderId, authCode });
    if (!order) {
        return res.status(400).json({ success: false, message: 'Could not find the device info.' });
    }

    const [deletedDevices, drives] = await Promise.all([
        await getScansCount({ deletionStatus: { $in: [HardDriveDeletionStatusEnum.DELETED, HardDriveDeletionStatusEnum.FAILED_DELETION] }, orderId: order._id }),
        await getAllScansSpecificOrder(order._id),
    ])
    return res.status(200).json({ success: true, data: { order, deletedDevices, totalDevices: order.devices, drives } });
}

module.exports = { checkDevice };
