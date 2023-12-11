const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/check-device', customerController.checkDevice);

module.exports = router;
