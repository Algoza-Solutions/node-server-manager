const path = require("path");

const isValidFilePath = (filePath) => {
  // Simple validation to check for forbidden characters or patterns
  const forbiddenPatterns = /[<>:"|?*]/;

  // Normalize the path to handle different path separators
  const normalizedPath = path.normalize(filePath);

  // Check for forbidden characters
  if (forbiddenPatterns.test(normalizedPath)) {
    return false;
  }

  // Additional checks can be added here if necessary

  return true;
};

module.exports = { isValidFilePath };
