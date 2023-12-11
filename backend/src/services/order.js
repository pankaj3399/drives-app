const HardDriveDeletionStatusEnum = require('../models/enum');
const HardDriveModel = require('../models/hard-drive');
const OrderModel = require('../models/order')

const createAOrder = async (data) => {
    try {
        return await OrderModel.create(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getAllOrders = async (query, offset, limit) => {
    try {
        return await OrderModel.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).lean();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateOrder = async (query, data) => {
    try {
        return await OrderModel.findOneAndUpdate(query, { $set: data }, { new: true }).lean();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getOrdersCount = async (query) => {
    try {
        return await OrderModel.countDocuments(query);
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getSingleOrder = async (query) => {
    try {
        return await OrderModel.findOne(query).lean();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getAllOrderStatusCounts = async () => {
    try {
        const allOrders = await HardDriveModel.aggregate([
            {
                $group: {
                    _id: { orderId: "$orderId", deletionStatus: "$deletionStatus" },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.orderId",
                    orders: {
                        $push: {
                            status: "$_id.deletionStatus",
                            count: "$count",
                        },
                    },
                },
            },
            {
                $project: {
                    orderId: "$_id",
                    orders: 1,
                    _id: 0,
                },
            },
        ]);
        const countsObj = {
            pending: 0,
            completed: 0,
        };

        allOrders.map(({ orders }) => {
            let pending = false;
            for (let order of orders) {
                if (order.status === HardDriveDeletionStatusEnum.NON_STARTED) {
                    pending = true;
                    break;
                }
            }
            pending ? countsObj.pending += 1 : countsObj.completed += 1;
        });

        return countsObj;
    } catch (error) {
        console.error("Error in getAllOrderStatusCounts:", error);
        throw error;
    }
};


module.exports = { getAllOrders, createAOrder, getOrdersCount, getSingleOrder, getAllOrderStatusCounts, updateOrder }