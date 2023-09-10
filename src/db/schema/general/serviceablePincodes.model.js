const { DataTypes } = require('sequelize');

const schema = '';
const tableName = `serviceablePincodes`;

const definition = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    field: 'id',
    primaryKey: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'city',
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'state',
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'pincode',
  },
  isActive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'isactive',
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'createdat',
  },
  updatedAt: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'updatedat',
  },
};

module.exports = (sequelize) => {
  const table = sequelize.define(tableName, definition, {
    schema,
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  });
  return table;
};
