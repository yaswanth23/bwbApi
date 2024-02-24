const express = require('express');
const defaultRouter = express.Router();
const { PingController } = require('../controllers');
const authRouter = require('./auth.router');
const generalRouter = require('./general.router');
const labRouter = require('./lab.router');
const cartRouter = require('./cart.router');
const diagnosticsRouter = require('./diagnostics.router');
const adminRouter = require('./admin.router');
const videoConsultationRouter = require('./videoConsultation.router');

/**
 * @swagger
 * /api/ping:
 *   get:
 *     tags:
 *       - Ping
 *     summary: Ping the server
 *     description: Ping the server to check its availability and get server information
 *     responses:
 *       200:
 *         description: Successful response with server information
 *       500:
 *         description: Internal server error
 */
defaultRouter.get('/ping', [PingController.GET_ping]);

const init = (app) => {
  app.use('/api', defaultRouter);
  app.use('/api/v1', authRouter);
  app.use('/api/v1', generalRouter);
  app.use('/api/v1', labRouter);
  app.use('/api/v1', cartRouter);
  app.use('/api/v1', diagnosticsRouter);
  app.use('/api/v1', adminRouter);
  app.use('/api/v1', videoConsultationRouter);
};

module.exports = init;
