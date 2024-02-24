const { DataTypes } = require('sequelize');

const schema = '';
const tableName = `diagnosticsTestAttributesStore`;

const definition = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    field: 'id',
    primaryKey: true,
  },
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'partnerid',
  },
  testId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'testid',
  },
  attributeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'attributeid',
  },
  attributeValue: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'attributevalue',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
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
  table.associate = (models) => {
    table.belongsTo(models.GeneralSchema.DiagnosticsTestAttributes, {
      foreignKey: 'attributeId',
      targetKey: 'attributeId',
    });
  };
  return table;
};
