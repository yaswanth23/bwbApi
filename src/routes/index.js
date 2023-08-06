const express = require('express');
const defaultRouter = express.Router();
const { PingController } = require('../controllers');

/**
 * @swagger
 * /ping:
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
defaultRouter.get('/ping', PingController.GET_ping);

const init = (app) => {
  app.use('/api', defaultRouter);
};

module.exports = init;
