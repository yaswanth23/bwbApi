const mongoose = require('mongoose');

const patientDetailsSchema = new mongoose.Schema({
  patientDetails: { type: Array, required: true },
  addressDetails: { type: Array },
  mobileNumber: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const patientDetails = mongoose.model(
  'patientDetails',
  patientDetailsSchema,
  'patientDetails'
);

module.exports = patientDetails;
