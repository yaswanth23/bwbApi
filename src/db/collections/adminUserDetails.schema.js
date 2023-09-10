const mongoose = require('mongoose');
const moment = require('moment');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

const adminUserDetailsSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  partnerName: { type: String },
  partnerId: { type: Number },
  roleId: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: istTimestamp },
  updatedOn: { type: Date, default: istTimestamp },
});

const adminUserDetails = mongoose.model(
  'adminUserDetails',
  adminUserDetailsSchema,
  'adminUserDetails'
);

module.exports = adminUserDetails;
