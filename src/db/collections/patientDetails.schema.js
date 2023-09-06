const mongoose = require('mongoose');
const moment = require('moment');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

const patientDetailsSchema = new mongoose.Schema({
  patientDetails: { type: Array, required: true },
  addressDetails: { type: Array },
  mobileNumber: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: istTimestamp },
  updatedOn: { type: Date, default: istTimestamp },
});

const patientDetails = mongoose.model(
  'patientDetails',
  patientDetailsSchema,
  'patientDetails'
);

module.exports = patientDetails;
