const express = require('express');
const router = express.Router();
const adminAuthentication = require('../middlewares/authenticate');
const { 
    addCustomer,
    getCustomers, 
    createOrder, 
    getOrders, 
    addNewScan, 
    getScan, 
    dashboardData, 
    getScans, 
    updateCustomerInfo,
    updateOrderInfo,
    updateScanDeletionStatus,
 } = require('../controllers/adminController');

router.get('/dashboard-data', adminAuthentication, dashboardData);
router.post('/create-customer', adminAuthentication, addCustomer);
router.patch('/update-customer/:id', adminAuthentication, updateCustomerInfo);
router.get('/get-all-customers', adminAuthentication, getCustomers);
router.post('/create-order', adminAuthentication, createOrder);
router.patch('/update-order/:id', adminAuthentication, updateOrderInfo);
router.get('/get-all-orders', adminAuthentication, getOrders);
router.post('/new-scan', adminAuthentication, addNewScan);
router.get('/get-scan', adminAuthentication, getScan);
router.patch('/delete-scan/:scanId', adminAuthentication, updateScanDeletionStatus);
router.get('/get-all-scans', adminAuthentication, getScans);
module.exports = router;
