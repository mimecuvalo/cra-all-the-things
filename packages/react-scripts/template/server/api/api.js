const express = require('express');
const path = require('path');
const winston = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');

const clientsideErrorsLogger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new WinstonDailyRotateFile({
      name: 'clientside-errors',
      filename: path.resolve(__dirname, '..', '..', 'logs', 'clientside-errors-%DATE%.log'),
      zippedArchive: true,
    }),
  ],
});

const router = express.Router();
router.get('/report-error', function(req, res) {
  clientsideErrorsLogger.error(JSON.parse(req.query.data));
  res.sendStatus(204);
});
router.post('/report-error', function(req, res) {
  clientsideErrorsLogger.error(req.body.data);
  res.sendStatus(204);
});

router.get('/', function(req, res) {
  res.sendStatus(404);
});

function addAPIToApp(app) {
  app.use('/api', router);
}

module.exports = addAPIToApp;
