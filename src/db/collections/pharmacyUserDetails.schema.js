const mongoose = require('mongoose');
const moment = require('moment');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

const PharmacyUserDetailsSchema = new mongoose.Schema({
  pharmacyName: { type: String, required: true },
  pharmacyPhone: { type: Number, required: true },
  pharmacyAddress: { type: String, required: true },
  pharmacyPincode: { type: Number, required: true },
  roleId: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: istTimestamp },
  updatedOn: { type: Date, default: istTimestamp },
});

const pharmacyUserDetails = mongoose.model(
  'pharmacyUserDetails',
  PharmacyUserDetailsSchema,
  'pharmacyUserDetails'
);

module.exports = pharmacyUserDetails;
