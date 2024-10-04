// util/logger.js
const { createLogger, format, transports } = require("winston");
const path = require("path");
const os = require("os");

const maxLogSize = 10 * 1024 * 1024; // 10 Megabytes

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ 
      filename: path.resolve(os.homedir(), ".nsm", "nsm.log"),
      maxsize: maxLogSize,
      maxFiles: 10
    }),
  ],
});

module.exports = logger;
