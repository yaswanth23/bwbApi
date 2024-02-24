const mongoose = require('mongoose');

const diagnosticBookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cartId: { type: String, required: true },
  cartItems: { type: Array, required: true },
  patientDetails: { type: Array, required: true },
  address: { type: Array, required: true },
  mobileNumber: { type: Number, required: true },
  pincode: { type: Number, required: true },
  timeSlot: { type: String, default: null },
  dateLabel: { type: String, default: null },
  collectionDate: { type: String, default: null },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
  reports: { type: Array, default: [] },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const diagnosticBookings = mongoose.model(
  'diagnosticBookings',
  diagnosticBookingSchema,
  'diagnosticBookings'
);

module.exports = diagnosticBookings;
