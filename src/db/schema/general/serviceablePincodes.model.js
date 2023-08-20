const { DataTypes } = require('sequelize');
const schema = '';
const tableName = `serviceablePincodes`;
const definition = {
  id: {
    type: DataTypes.INTEGER,
    field: 'id',
    primaryKey: true,
  },
  data: {
    type: DataTypes.STRING,
    field: 'data',
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
