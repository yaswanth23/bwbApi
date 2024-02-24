const mongoose = require('mongoose');

const userAuthPassDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  saltKey: { type: String, required: true },
  hashedKey: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const userAuthPassDetails = mongoose.model(
  'userAuthPassDetails',
  userAuthPassDetailsSchema,
  'userAuthPassDetails'
);

module.exports = userAuthPassDetails;
