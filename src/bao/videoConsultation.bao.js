const mongoose = require('mongoose');
const Base = require('./base');
const { AuthDao, AdminDao, VideoConsultationDao } = require('../dao');
const logger = require('../common/logger')('videoConsultation-bao');
const { ERROR_CODES, ERROR_MESSAGES } = require('../common/error.constants');
const { STATUS_CODES, APPLICATION } = require('../common/constants');
const error = new Error();

class VideoConsultationBao extends Base {
  constructor() {
    super();
  }

  async captureMeetingSchedules(params) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside captureMeetingSchedules bao');
      session.startTransaction();

      let whereObj;
      let updateObj;
      if (params.event === APPLICATION.CALENDLY_INVITEE_CREATED) {
        let pharmacyMobileNumber;
        let patientMobileNumber;

        params.payload.questions_and_answers.forEach((item) => {
          if (item.position === 0) {
            pharmacyMobileNumber = item.answer
              .replace('+91', '')
              .replace(/\s/g, '');
          } else if (item.position === 1) {
            patientMobileNumber = item.answer
              .replace('+91', '')
              .replace(/\s/g, '');
          }
        });

        whereObj = {
          pharmacyPhone: pharmacyMobileNumber,
        };

        let pharmacyUserData = await AuthDao.findPharmacyUser(
          whereObj,
          session
        );

        if (pharmacyUserData.length > 0) {
          whereObj = {
            emailId:
              params.payload.scheduled_event.event_memberships[0].user_email,
          };

          let doctorUserDetails = await AdminDao.findDoctorUserDetails(
            whereObj,
            session
          );

          let insertObj = {
            doctorUserId: doctorUserDetails[0]._id,
            pharmacyUserId: pharmacyUserData[0]._id,
            doctorMobileNumber: doctorUserDetails[0].mobileNumber,
            pharmacyMobileNumber: pharmacyUserData[0].pharmacyPhone,
            patientMobileNumber: patientMobileNumber,
            patientEmailId: params.payload.email,
            eventUri: params.payload.uri,
            patientName: params.payload.name,
            joinUrl: params.payload.scheduled_event.location.join_url,
            scheduledEventUri: params.payload.scheduled_event.uri,
            scheduledEventName: params.payload.scheduled_event.name,
            startTime: params.payload.scheduled_event.start_time,
            endTime: params.payload.scheduled_event.end_time,
            status: params.payload.scheduled_event.status,
            isActive: true,
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
          };

          await VideoConsultationDao.createVideoConsultationBookings(
            insertObj,
            session
          );
        }
      } else if (params.event === APPLICATION.CALENDLY_INVITEE_CANCELED) {
        whereObj = {
          scheduledEventUri: params.payload.scheduled_event.uri,
        };

        let videoEventDetails =
          await VideoConsultationDao.findVideoConsultationBookings(
            whereObj,
            session
          );

        if (videoEventDetails.length > 0) {
          updateObj = {
            status: params.payload.scheduled_event.status,
            updatedOn: new Date().toISOString(),
          };

          await VideoConsultationDao.updateVideoConsultationBookings(
            updateObj,
            whereObj
          );
        }
      }

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        successMessage: 'Meeting scheduled successfully!',
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }

  async getAllAppointments(params, limit, page) {
    const session = await mongoose.startSession();
    try {
      logger.info('inside captureMeetingSchedules bao');
      session.startTransaction();

      let offset = (page - 1) * limit;
      let whereObj = {
        _id: params.userId,
      };

      let doctorUserDetails = await AdminDao.findDoctorUserDetails(
        whereObj,
        session
      );

      let pharmacyUserData = await AuthDao.findPharmacyUser(whereObj, session);

      if (doctorUserDetails.length > 0) {
        whereObj = {
          doctorUserId: params.userId,
        };
      }

      if (pharmacyUserData.length > 0) {
        whereObj = {
          pharmacyUserId: params.userId,
        };
      }

      let allAppointments =
        await VideoConsultationDao.getAllVideoConsultationBookings(
          whereObj,
          limit,
          offset,
          session
        );

      let totalAppointmentCount =
        await VideoConsultationDao.getVideoConsultationBookingsCount(
          whereObj,
          session
        );

      let totalPages = totalAppointmentCount / limit;

      await session.commitTransaction();
      session.endSession();
      return {
        successCode: STATUS_CODES.STATUS_CODE_200,
        allAppointments: allAppointments,
        metaData: {
          totalBookingCount: totalAppointmentCount,
          totalPages: totalPages ? Math.ceil(totalPages) : 1,
        },
      };
    } catch (e) {
      logger.error(e);
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
}

module.exports = VideoConsultationBao;
