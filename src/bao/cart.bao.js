const mongoose = require('mongoose');
const moment = require('moment');
const Base = require('./base');
const logger = require('../common/logger')('cart-bao');
const { AuthDao, CartDao, GeneralDao } = require('../dao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const CartHelper = require('../common/cartHelper');
const TimeSlotHelper = require('../common/timeSlotHelper');
const istTimestamp = moment.utc().add(5, 'hours').add(30, 'minutes').toDate();
const error = new Error();

class CartBao extends Base {
  constructor() {
    super();
  }

  async getCartItemsCount(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getCartItemsCount bao', params);
      session.startTransaction();

      let whereObj = {
        _id: params.userId,
      };
      let pharmacyUserData = await AuthDao.findPharmacyUser(whereObj, session);
      if (!pharmacyUserData.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      whereObj = {
        _id: params.cartId,
        userId: params.userId,
      };

      let cartDetails = await CartDao.findCartDetails(whereObj, session);

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        cartCount: cartDetails[0].cartItems.length,
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async addCartItems(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getCartItemsCount bao', params);
      session.startTransaction();

      let whereObj = {
        _id: params.cartId,
        userId: params.userId,
      };

      let cartDetails = await CartDao.findCartDetails(whereObj, session);

      if (!cartDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      const existingCartItems = new Set(
        cartDetails[0].cartItems.map((item) => item.testId)
      );

      const newCartItems = params.cartItems.filter(
        (item) => !existingCartItems.has(item.testId)
      );

      let updateObj = {
        cartItems: [...cartDetails[0].cartItems, ...newCartItems],
        selectedPincode: params.selectedPincode,
        updatedOn: istTimestamp,
      };

      await CartDao.updateCartItems(updateObj, whereObj, session);

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'Items added to the cart successfully',
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async getCartItems(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getCartItems bao', params);
      session.startTransaction();

      let whereObj = {
        _id: params.cartId,
        userId: params.userId,
      };

      let cartDetails = await CartDao.findCartDetails(whereObj, session);

      if (!cartDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      let cartItems = [];
      let totalPrice = 0;
      let timeSlots = [];

      if (cartDetails[0].cartItems.length > 0) {
        await Promise.all(
          cartDetails[0].cartItems.map(async (item) => {
            let finalObj = {};
            finalObj.diagnosticTestId = item.testId;
            finalObj.itemId = item._id;
            let diagnosticsTestData = await CartHelper.getDiagnosticTestDetails(
              item.testId
            );
            finalObj = { ...finalObj, ...diagnosticsTestData };
            let timeSlotObj = {
              testId: item.testId,
              schedule: diagnosticsTestData.schedule,
              startTime: '06:00 AM',
              cutOffTime: diagnosticsTestData.cutOffTime,
            };
            let timeSlotResponse =
              await TimeSlotHelper.calculateCommonTimeSlots(timeSlotObj);
            totalPrice += +diagnosticsTestData.mrp;
            cartItems.push(finalObj);
            timeSlots.push(timeSlotResponse);
          })
        );
      }

      let commonAvailableDates = await this.getCommonAvailableDates(timeSlots);

      const commonTimeSlots = [];
      const uniqueDatesSet = new Set();
      if (commonAvailableDates.length > 0) {
        for (const item of timeSlots) {
          const { testId, availableTimeSlots } = item;
          for (const slot of availableTimeSlots) {
            const { dateLabel, date, timeSlots } = slot;
            if (commonAvailableDates.includes(date)) {
              if (!uniqueDatesSet.has(date)) {
                uniqueDatesSet.add(date);
                commonTimeSlots.push({
                  dateLabel,
                  date,
                  timeSlots: timeSlots,
                });
              }
            }
          }
        }
      } else {
        let similarTimeSlotTestIds = await this.separateTestIdsWithCommonDates(
          timeSlots
        );
        console.log(similarTimeSlotTestIds);
        if (similarTimeSlotTestIds.length > 0) {
          let similarTestIds = similarTimeSlotTestIds[0].testIds;

          commonAvailableDates = [];
          similarTimeSlotTestIds.forEach((item) => {
            commonAvailableDates.push(item.date);
          });

          for (const item of timeSlots) {
            const { testId, availableTimeSlots } = item;
            for (const slot of availableTimeSlots) {
              const { dateLabel, date, timeSlots } = slot;
              if (commonAvailableDates.includes(date)) {
                if (!uniqueDatesSet.has(date)) {
                  uniqueDatesSet.add(date);
                  commonTimeSlots.push({
                    dateLabel,
                    date,
                    timeSlots: timeSlots,
                  });
                }
              }
            }
          }

          cartItems = cartItems.map((item) => {
            if (!similarTestIds.includes(item.diagnosticTestId)) {
              return {
                ...item,
                disclaimer: `Note: this test will be automatically picked on ${item.schedule}`,
              };
            } else {
              return item;
            }
          });
        } else {
          cartItems = cartItems.map((item) => {
            return {
              ...item,
              disclaimer: `Note: this test will be automatically picked on ${item.schedule}`,
            };
          });
        }
      }

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        cartItems: cartItems,
        totalPrice: totalPrice,
        commonTimeSlots: commonTimeSlots,
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async removeCartItems(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside getCartItems bao', params);
      session.startTransaction();
      await session.commitTransaction();

      let whereObj = {
        _id: params.cartId,
        userId: params.userId,
      };

      let cartDetails = await CartDao.findCartDetails(whereObj, session);

      if (!cartDetails.length) {
        error.message = ERROR_MESSAGES.ERROR_MESSAGE_USER_NOT_FOUND;
        error.code = ERROR_CODES.ERROR_CODE_404;
        throw error;
      }

      let updateObj = {
        $pull: {
          cartItems: {
            _id: params.itemId,
          },
        },
      };

      await CartDao.updateCartItems(updateObj, whereObj, session);

      cartDetails = await CartDao.findCartDetails(whereObj, session);

      let cartItems = [];
      let totalPrice = 0;
      let timeSlots = [];

      if (cartDetails[0].cartItems.length > 0) {
        await Promise.all(
          cartDetails[0].cartItems.map(async (item) => {
            let finalObj = {};
            finalObj.diagnosticTestId = item.testId;
            finalObj.itemId = item._id;
            let diagnosticsTestData = await CartHelper.getDiagnosticTestDetails(
              item.testId
            );
            finalObj = { ...finalObj, ...diagnosticsTestData };
            let timeSlotObj = {
              testId: item.testId,
              schedule: diagnosticsTestData.schedule,
              startTime: '06:00 AM',
              cutOffTime: diagnosticsTestData.cutOffTime,
            };
            let timeSlotResponse =
              await TimeSlotHelper.calculateCommonTimeSlots(timeSlotObj);
            totalPrice += +diagnosticsTestData.mrp;
            cartItems.push(finalObj);
            timeSlots.push(timeSlotResponse);
          })
        );
      }

      let commonAvailableDates = await this.getCommonAvailableDates(timeSlots);

      const commonTimeSlots = [];
      const uniqueDatesSet = new Set();
      if (commonAvailableDates.length > 0) {
        for (const item of timeSlots) {
          const { testId, availableTimeSlots } = item;
          for (const slot of availableTimeSlots) {
            const { dateLabel, date, timeSlots } = slot;
            if (commonAvailableDates.includes(date)) {
              if (!uniqueDatesSet.has(date)) {
                uniqueDatesSet.add(date);
                commonTimeSlots.push({
                  dateLabel,
                  date,
                  timeSlots: timeSlots,
                });
              }
            }
          }
        }
      } else {
        let similarTimeSlotTestIds = await this.separateTestIdsWithCommonDates(
          timeSlots
        );
        let similarTestIds = similarTimeSlotTestIds[0].testIds;

        commonAvailableDates = [];
        similarTimeSlotTestIds.forEach((item) => {
          commonAvailableDates.push(item.date);
        });

        for (const item of timeSlots) {
          const { testId, availableTimeSlots } = item;
          for (const slot of availableTimeSlots) {
            const { dateLabel, date, timeSlots } = slot;
            if (commonAvailableDates.includes(date)) {
              if (!uniqueDatesSet.has(date)) {
                uniqueDatesSet.add(date);
                commonTimeSlots.push({
                  dateLabel,
                  date,
                  timeSlots: timeSlots,
                });
              }
            }
          }
        }

        cartItems = cartItems.map((item) => {
          if (!similarTestIds.includes(item.diagnosticTestId)) {
            return {
              ...item,
              disclaimer: `Note: this test will be automatically picked on ${item.schedule}`,
            };
          } else {
            return item;
          }
        });
      }

      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'Item removed successfully',
        cartItems: cartItems,
        totalPrice: totalPrice,
        commonTimeSlots: commonTimeSlots,
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async getCommonAvailableDates(timeSlots) {
    const uniqueDates = new Set(
      timeSlots[0].availableTimeSlots.map((slot) => slot.date)
    );

    for (let i = 1; i < timeSlots.length; i++) {
      const currentObject = timeSlots[i];
      const currentObjectDates = new Set(
        currentObject.availableTimeSlots.map((slot) => slot.date)
      );

      uniqueDates.forEach((date) => {
        if (!currentObjectDates.has(date)) {
          uniqueDates.delete(date);
        }
      });
    }

    const commonAvailableDates = Array.from(uniqueDates);
    return commonAvailableDates;
  }

  async separateTestIdsWithCommonDates(testSlots) {
    const testIdsWithCommonDates = {};

    for (const testSlot of testSlots) {
      const { testId, availableTimeSlots } = testSlot;
      for (const slot of availableTimeSlots) {
        const { date } = slot;
        if (!testIdsWithCommonDates[date]) {
          testIdsWithCommonDates[date] = [];
        }
        testIdsWithCommonDates[date].push(testId);
      }
    }

    const result = [];

    for (const date in testIdsWithCommonDates) {
      if (testIdsWithCommonDates[date].length > 1) {
        result.push({
          date,
          testIds: testIdsWithCommonDates[date],
        });
      }
    }

    const testIdsCount = {};
    for (const entry of result) {
      const key = entry.testIds.join(',');
      testIdsCount[key] = (testIdsCount[key] || 0) + 1;
    }

    const filteredResult = result.filter((entry) => {
      const key = entry.testIds.join(',');
      return testIdsCount[key] > 1;
    });

    return filteredResult;
  }
}

module.exports = CartBao;
