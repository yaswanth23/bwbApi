const mongoose = require('mongoose');
const moment = require('moment');
const Base = require('./base');
const logger = require('../common/logger')('cart-bao');
const { AuthDao, CartDao, GeneralDao } = require('../dao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES } = require('../common/constants');
const CartHelper = require('../common/cartHelper');
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
            totalPrice += +diagnosticsTestData.mrp;
            cartItems.push(finalObj);
          })
        );
      }

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        cartItems: cartItems,
        totalPrice: totalPrice,
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
            totalPrice += +diagnosticsTestData.mrp;
            cartItems.push(finalObj);
          })
        );
      }

      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'Item removed successfully',
        cartItems: cartItems,
        totalPrice: totalPrice,
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
}

module.exports = CartBao;
