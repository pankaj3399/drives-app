const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  devices: Number,
  collectionDate: Date,
  authCode: {
    type: String,
    unique: true,
  },
  completionDate: Date,
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const OrderModel = mongoose.model('order', orderSchema);
module.exports = OrderModel;