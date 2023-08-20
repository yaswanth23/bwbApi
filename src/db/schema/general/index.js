module.exports = (sequelize) => {
  const ServiceablePincodes = require('./serviceablePincodes.model')(sequelize);
  return {
    Schema: 'GeneralSchema',
    ServiceablePincodes,
  };
};
