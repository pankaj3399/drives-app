const CustomerModel = require('../models/customer')

const addCustomerIntoDB = async (data) => {
    try {
        return await CustomerModel.create(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

const findCustomer = async (query) => {
    try {
        return await CustomerModel.findOne(query).lean();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateCustomer = async (query, data) => {
    try {
        return await CustomerModel.findOneAndUpdate(query, { $set: data }, { new: true }).lean();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getAllCustomers = async (query, offset, limit) => {
    try {
        return await CustomerModel.find(query).sort({ createdAt: -1 }).sort({ createdAt: -1 }).skip(offset).limit(limit).lean();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getCustomersCount = async (query) => {
    try {
        return await CustomerModel.countDocuments(query);
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { getAllCustomers, addCustomerIntoDB, findCustomer, getCustomersCount, updateCustomer }