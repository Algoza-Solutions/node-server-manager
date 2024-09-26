const logger = require('./logger');

const handleError = (error, message) => {
  logger.error(`${message}: ${error.message}`);
  // Optionally, process exit or throw error
};

module.exports = { handleError };
