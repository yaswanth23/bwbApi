const mongoose = require('mongoose');

const PharmacyUserDetailsSchema = new mongoose.Schema({
  pharmacyName: String,
  pharmacyPhone: Number,
  pharmacyAddress: String,
  pharmacyPincode: Number,
  isActive: Boolean,
  createdOn: Date,
  updatedOn: Date,
});

const pharmacyUserDetails = mongoose.model(
  'pharmacyUserDetails',
  PharmacyUserDetailsSchema,
  'pharmacyUserDetails'
);

module.exports = pharmacyUserDetails;
