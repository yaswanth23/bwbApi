module.exports = (sequelize) => {
  const BookingCaptureStates = require('./bookingCaptureStates.model')(
    sequelize
  );
  const BookingStates = require('./bookingStates.model')(sequelize);
  const BookingStateTransition = require('./bookingStateTransition.model')(
    sequelize
  );

  return {
    Schema: 'BookingSchema',
    BookingCaptureStates,
    BookingStates,
    BookingStateTransition,
  };
};
