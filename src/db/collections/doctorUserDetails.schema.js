const mongoose = require('mongoose');

const doctorUserDetailsSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  emailId: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  specialty: { type: String, required: true },
  yearsOfPractice: { type: Number, required: true },
  hospitalAffiliation: { type: String, required: true },
  clinicAffiliation: { type: String, default: null },
  calendlyUserUrl: { type: String, default: null },
  calendlyUserCalenderUrl: { type: String, default: null },
  profileImageUrl: { type: String, default: null },
  roleId: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const doctorUserDetails = mongoose.model(
  'doctorUserDetails',
  doctorUserDetailsSchema,
  'doctorUserDetails'
);

module.exports = doctorUserDetails;
