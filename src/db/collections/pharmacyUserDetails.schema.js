const mongoose = require('mongoose');

const PharmacyUserDetailsSchema = new mongoose.Schema({
  pharmacyName: { type: String, required: true },
  pharmacyPhone: { type: Number, required: true },
  pharmacyAddress: { type: String, required: true },
  pharmacyPincode: { type: Number, required: true },
  roleId: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const pharmacyUserDetails = mongoose.model(
  'pharmacyUserDetails',
  PharmacyUserDetailsSchema,
  'pharmacyUserDetails'
);

module.exports = pharmacyUserDetails;
