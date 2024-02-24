const { DataTypes } = require('sequelize');

const schema = '';
const tableName = `partnerDetails`;

const definition = {
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    field: 'partnerid',
    primaryKey: true,
  },
  partnerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'partnername',
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
