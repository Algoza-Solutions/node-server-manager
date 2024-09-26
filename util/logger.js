const { createLogger, format, transports } = require('winston');
const path = require('path');
const os = require('os');

const logFilePath = path.join(os.homedir(), '.nsm', 'nsm.log');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath }),
  ],
});

module.exports = logger;
