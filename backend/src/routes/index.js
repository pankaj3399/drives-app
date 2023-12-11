const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const customerRoutes = require('./customer');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);


module.exports = router;
