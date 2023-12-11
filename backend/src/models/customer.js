const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: String,
  email: {
    type: String,
    unique: true,
  },
  emailSendStatus: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const CustomerModel = mongoose.model('customer', customerSchema);
module.exports = CustomerModel;
