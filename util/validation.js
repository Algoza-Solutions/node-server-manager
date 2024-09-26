const path = require('path');

const isValidFilePath = (filePath) => {
  // Simple validation to check for forbidden characters or patterns
  const forbiddenPatterns = /[<>:"|?*]/;
  return !forbiddenPatterns.test(filePath) && path.isAbsolute(filePath);
};

module.exports = { isValidFilePath };
