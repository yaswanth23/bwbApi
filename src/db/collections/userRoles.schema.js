const mongoose = require('mongoose');

const userRolesSchema = new mongoose.Schema({
  roleId: { type: Number, required: true },
  roleName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date().toISOString() },
  updatedOn: { type: Date, default: new Date().toISOString() },
});

const userRoles = mongoose.model('userRoles', userRolesSchema, 'userRoles');

module.exports = userRoles;
