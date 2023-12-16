const {
    customerValidation,
    getQueryCustomersValidation,
    orderValidation,
    getQueryOrdersValidation,
    scanValidation,
    updateOrderValidation,
    updateScanValidation
} = require('../validations/admin');
const {
    createAOrder,
    getAllOrders,
    getOrdersCount,
    getSingleOrder,
    getAllOrderStatusCounts,
    updateOrder
} = require('../services/order');
const {
    createAScan,
    getAScan,
    getScansCount,
    getAllScans,
    updateScan,
    getAllScansSpecificOrder,
    updateScans
} = require('../services/scan');
const {
    getAllCustomers,
    findCustomer,
    addCustomerIntoDB,
    getCustomersCount,
    updateCustomer
} = require('../services/customer');
const generateAuthCode = require('../utils/generate-auth-code');
const HardDriveDeletionStatusEnum = require('../models/enum');
const sendEmail = require('../utils/send-email');
const completeOrderEmailTemplate = require('../utils/email-template');

async function addCustomer(req, res) {
    try {
        const { email } = req.body;

        const validation = customerValidation(req.body);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }

        const customer = await findCustomer({ email });
        if (customer) {
            return res.status(400).json({ success: false, message: 'Already customer email exists' });
        }

        const newCustomer = await addCustomerIntoDB(req.body);
        if (!newCustomer) {
            return res.status(400).json({ success: false, message: 'Could not create a new customer' });
        }
        return res.json({ success: true, data: newCustomer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function updateCustomerInfo(req, res) {
    try {
        const { id } = req.params;
        const customer = await updateCustomer({ _id: id }, req.body);
        if (!customer) {
            return res.status(400).json({ success: false, message: 'Failed to update customer email send status' });
        }
        return res.json({ success: true, data: customer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function getCustomers(req, res) {
    try {
        const validation = getQueryCustomersValidation(req.query);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }
        const { page, limit = Number.MAX_SAFE_INTEGER, ...rest } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        if (rest?.email) {
            rest.email = new RegExp(rest.email, 'i');
        }

        // Find all customers in the database
        const [customers, total] = await Promise.all([
            await getAllCustomers(rest || {}, offset, limit),
            await getCustomersCount(rest || {}),
        ]);
        return res.json({
            success: true, data: {
                customers,
                pageCount: Math.ceil(total / Number(limit)),
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function createOrder(req, res) {
    try {
        const validation = orderValidation(req.body);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }

        const authCode = await generateAuthCode();
        const order = await createAOrder({ ...req.body, authCode });
        if (!order) {
            return res.status(400).json({ success: false, message: 'Could not create a new order' });
        }
        return res.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function updateOrderInfo(req, res) {
    try {
        const { id } = req.params;
        const validation = updateOrderValidation(req.body);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }
        const order = await updateOrder({ _id: id }, req.body);
        if (!order) {
            return res.status(400).json({ success: false, message: 'Failed to update order info' });
        }
        const { completionDate } = req.body;
        if (order && completionDate) {
            // added deletionDate for other drives 
            const hardDrives = await getAllScans({ orderId: order._id });
            const [updatedDrives, user] = await Promise.all([
                await updateScans(
                    {
                        _id: { $in: hardDrives.map(hardDrive => hardDrive._id) },
                        deletionStatus: { $eq: HardDriveDeletionStatusEnum.NON_STARTED }
                    },
                    {
                        deletionDate: completionDate,
                        deletionStatus: HardDriveDeletionStatusEnum.DELETED,
                    }
                ),
                await findCustomer({ _id: order.customerId, emailSendStatus: true }),
            ]);
            const scans = await getAllScansSpecificOrder(order._id);
            if (updatedDrives && user && scans.length) {
                let drivesDeleted = 0;
                let failedDeletion = 0;
                for (const scan of scans) {
                    if (scan.deletionStatus === HardDriveDeletionStatusEnum.DELETED) {
                        drivesDeleted += 1;
                    }
                    if (scan.deletionStatus === HardDriveDeletionStatusEnum.FAILED_DELETION) {
                        failedDeletion += 1;
                    }
                }
                // send email
                const emailTemplate = completeOrderEmailTemplate({
                    customerName: user.name,
                    orderId: order._id,
                    totalDrives: scans.length,
                    drivesDeleted,
                    failedDeletion,
                });
                sendEmail(user.email, 'Order Deletion Done', emailTemplate);
            }
        }
        return res.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function getOrders(req, res) {
    try {
        const validation = getQueryOrdersValidation(req.query);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }

        const { page, limit = Number.MAX_SAFE_INTEGER, ...rest } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        if (rest?.customerId) {
            rest.customerId = rest.customerId;
        }
        if (rest?.orderId) {
            rest._id = rest.orderId;
        }

        // Find all orders in the database
        const [orders, total] = await Promise.all([
            await getAllOrders(rest || {}, offset, limit),
            await getOrdersCount(rest || {}),
        ]);
        await Promise.all(orders.map(async order => {
            const customerId = order.customerId;
            const customerInfo = await findCustomer({ _id: customerId });
            order.customer = customerInfo;
            return order;
        }));
        return res.json({
            success: true, data: {
                orders,
                pageCount: Math.ceil(total / Number(limit)),
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function addNewScan(req, res) {
    try {
        const validation = scanValidation(req.body);
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }

        const checkValidOrder = await getSingleOrder({
            _id: req.body.orderId,
            customerId: req.body.customerId,
            completionDate: { $exists: false }
        });
        if (!checkValidOrder) {
            return res.status(400).json({ success: false, message: 'Invalid Order Id or order is already completed' });
        }

        const checkUniqueSerialNumber = await getAScan({ serialNumber: req.body.serialNumber });
        if (checkUniqueSerialNumber) {
            return res.status(400).json({ success: false, message: 'Please enter unique serial number' });
        }

        const scans = await getAllScansSpecificOrder(checkValidOrder._id);
        if (scans.length >= checkValidOrder.devices) {
            return res.status(400).json({ success: false, message: `Already added ${checkValidOrder.devices} devices` });
        }

        const scan = await createAScan(req.body);
        if (!scan) {
            return res.status(400).json({ success: false, message: 'Could not add scan device' });
        }
        return res.json({ success: true, data: scan });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function getScan(req, res) {
    try {
        const { serialNumber } = req.query;
        if (!serialNumber || serialNumber === '') {
            return res.status(422).json({ success: false, message: 'Provide a valid serial number' });
        }

        const scan = await getAScan(req.query);
        if (!scan) {
            return res.status(400).json({ success: false, message: 'Could not get scan device' });
        }
        return res.json({ success: true, data: scan });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function updateScanDeletionStatus(req, res) {
    try {
        const { scanId } = req.params;
        const { status } = req.body;
        const validation = updateScanValidation({ scanId, status });
        if (validation.error) {
            return res.status(422).json({ success: false, message: validation.error.details[0].message });
        }

        // Run your script to update
        const scan = await updateScan({ _id: scanId }, { deletionStatus: status, deletionDate: new Date() });
        if (!scan) {
            return res.status(400).json({ success: false, message: 'Failed to delete scan device' });
        }
        const scans = await getAllScansSpecificOrder(scan.orderId);
        let isCompleted = true;
        let drivesDeleted = 0;
        let failedDeletion = 0;
        for (const scan of scans) {
            if (scan.deletionStatus === HardDriveDeletionStatusEnum.NON_STARTED) {
                isCompleted = false;
                break;
            }
            if (scan.deletionStatus === HardDriveDeletionStatusEnum.DELETED) {
                drivesDeleted += 1;
            }
            if (scan.deletionStatus === HardDriveDeletionStatusEnum.FAILED_DELETION) {
                failedDeletion += 1;
            }
        }
        if (isCompleted) {
            const order = await updateOrder({ _id: scan.orderId }, { completionDate: new Date() });
            const user = await findCustomer({ _id: order.customerId, emailSendStatus: true });
            if (user) {
                // send email
                const emailTemplate = completeOrderEmailTemplate({
                    customerName: user.name,
                    orderId: order._id,
                    totalDrives: scans.length,
                    drivesDeleted,
                    failedDeletion,
                });
                sendEmail(user.email, 'Order Deletion Done', emailTemplate);
            }
        }
        return res.json({ success: true, data: scan });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function getScans(req, res) {
    try {
        const scans = await getAllScans();
        return res.json({ success: true, data: scans });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function dashboardData(req, res) {
    try {
        const [customers, scannedDevices, deletedDevices, orders, pendingDevices] = await Promise.all([
            await getCustomersCount({}),
            await getScansCount({}),
            await getScansCount({ deletionStatus: { $in: [HardDriveDeletionStatusEnum.DELETED, HardDriveDeletionStatusEnum.FAILED_DELETION] } }),
            await getAllOrderStatusCounts(),
            await getScansCount({ deletionStatus: HardDriveDeletionStatusEnum.NON_STARTED }),
        ]);
        return res.json({
            success: true, data: {
                customers,
                scannedDevices,
                deletedDevices,
                pendingDevices,
                pendingOrders: orders.pending,
                completedOrders: orders.completed,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    getCustomers,
    addCustomer,
    createOrder,
    getOrders,
    addNewScan,
    getScan,
    dashboardData,
    getScans,
    updateCustomerInfo,
    updateOrderInfo,
    updateScanDeletionStatus,
};
