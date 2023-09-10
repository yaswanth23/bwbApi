const mongoose = require('mongoose');
const moment = require('moment');

const adminUserDetailsSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  partnerName: { type: String },
  partnerId: { type: Number },
  roleId: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const adminUserDetails = mongoose.model(
  'adminUserDetails',
  adminUserDetailsSchema,
  'adminUserDetails'
);

module.exports = adminUserDetails;
