const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
});

const AdminModel = mongoose.model('admin', AdminSchema);
module.exports = AdminModel;
