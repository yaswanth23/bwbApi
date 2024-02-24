const moment = require('moment-timezone');

module.exports.calculateCommonTimeSlots = async (test) => {
  const numberOfDays = 10;
  const IST = 'Asia/Kolkata';
  const now = moment.tz(IST);
  const timeSlotResponse = [];

  const scheduleDays = test.schedule.split(',').map((day) => day.trim());

  if (test.schedule.toLowerCase().includes(' to ')) {
    for (let i = 0; i <= numberOfDays; i++) {
      const currentDate = now.clone().add(i, 'days');
      const dateLabelAbbreviation = currentDate.format('ddd');
      const date = currentDate.format('D MMM');

      const schedule = test.schedule.toLowerCase();

      if (schedule.includes(' to ')) {
        const [startDay, endDay] = schedule.split(' to ');
        const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const startIndex = daysOfWeek.indexOf(startDay);
        const endIndex = daysOfWeek.indexOf(endDay);

        if (
          startIndex !== -1 &&
          endIndex !== -1 &&
          daysOfWeek.indexOf(dateLabelAbbreviation.toLowerCase()) >=
            startIndex &&
          daysOfWeek.indexOf(dateLabelAbbreviation.toLowerCase()) <= endIndex
        ) {
          let startTime = moment(test.startTime, 'hh:mm A');
          const cutOffTime = moment(test.cutOffTime, 'hh:mm A');
          const timeSlots = [];

          if (i == 0) {
            const currentTime = moment().tz(IST);
            if (!startTime.isAfter(currentTime)) {
              const aheadTime = currentTime.add(1, 'hour').startOf('hour');
              startTime = moment(aheadTime, 'hh:mm A');
            }
          }

          while (startTime.isBefore(cutOffTime)) {
            const slot = {
              availableTimeSlots: `${startTime.format('hh:mm A')} - ${startTime
                .add(1, 'hour')
                .format('hh:mm A')}`,
            };
            timeSlots.push(slot);
          }

          timeSlotResponse.push({
            dateLabel: currentDate.format('dddd'),
            date,
            timeSlots,
          });
        }
      }
    }
  } else {
    for (let i = 0; i <= numberOfDays; i++) {
      const currentDate = now.clone().add(i, 'days');
      const dateLabelAbbreviation = currentDate.format('ddd');
      const date = currentDate.format('D MMM');
      if (scheduleDays.includes(dateLabelAbbreviation)) {
        let startTime = moment(test.startTime, 'hh:mm A');
        const cutOffTime = moment(test.cutOffTime, 'hh:mm A');
        const timeSlots = [];

        if (i == 0) {
          const currentTime = moment().tz(IST);
          if (!startTime.isAfter(currentTime)) {
            const aheadTime = currentTime.add(1, 'hour').startOf('hour');
            startTime = moment(aheadTime, 'hh:mm A');
          }
        }

        while (startTime.isBefore(cutOffTime)) {
          const slot = {
            availableTimeSlots: `${startTime.format('hh:mm A')} - ${startTime
              .add(1, 'hour')
              .format('hh:mm A')}`,
          };
          timeSlots.push(slot);
        }

        timeSlotResponse.push({
          dateLabel: currentDate.format('dddd'),
          date,
          timeSlots,
        });
      }
    }
  }

  return { testId: test.testId, availableTimeSlots: timeSlotResponse };
};
