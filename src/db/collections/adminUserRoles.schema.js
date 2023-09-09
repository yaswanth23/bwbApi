const mongoose = require('mongoose');
const moment = require('moment');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();

const adminUserRolesSchema = new mongoose.Schema({
  roleId: { type: Number, required: true },
  roleName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: istTimestamp },
  updatedOn: { type: Date, default: istTimestamp },
});

const adminUserRoles = mongoose.model(
  'adminUserRoles',
  adminUserRolesSchema,
  'adminUserRoles'
);

module.exports = adminUserRoles;
