const mongoose = require('mongoose');

const videoConsultationBookingSchema = new mongoose.Schema({
  doctorUserId: { type: String, required: true },
  pharmacyUserId: { type: String, required: true },
  doctorMobileNumber: { type: Number, required: true },
  pharmacyMobileNumber: { type: Number, required: true },
  patientMobileNumber: { type: Number, required: true },
  patientEmailId: { type: String, required: true },
  eventUri: { type: String, required: true },
  patientName: { type: String, required: true },
  joinUrl: { type: String, required: true },
  scheduledEventUri: { type: String, required: true },
  scheduledEventName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const videoConsultationBookings = mongoose.model(
  'videoConsultationBookings',
  videoConsultationBookingSchema,
  'videoConsultationBookings'
);

module.exports = videoConsultationBookings;
