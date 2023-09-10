const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  testName: { type: String, required: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const cartDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  cartItems: [cartItemSchema],
  selectedPincode: { type: Number, default: null },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const cartDetails = mongoose.model(
  'cartDetails',
  cartDetailsSchema,
  'cartDetails'
);

module.exports = cartDetails;
