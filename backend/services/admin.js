const AdminModel = require('../models/admin')

const findAnyAdminExists = async () => {
    try {
        return await AdminModel.countDocuments();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const addAdmin = async (data) => {
    try {
        return await AdminModel.create(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

const findAdmin = async (query) => {
    try {
        return await AdminModel.findOne(query);
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { findAdmin, addAdmin, findAnyAdminExists }