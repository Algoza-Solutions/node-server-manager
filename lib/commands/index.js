#!/usr/bin/env node

const { program } = require("commander");
const { isFileExist } = require("../../util/file");
const { isValidFilePath } = require("../../util/validation");
const {
  startServer,
  stopServer,
  checkServerStatus,
  restartServer,
} = require("../api/processManager");
const path = require("path");
const os = require("os");
const logger = require("../../util/logger");
const { handleError } = require("../../util/errorHandler");

// Define default log file path
const defaultLogFilePath = path.join(os.homedir(), "node.log");

program
  .name("nsm")
  .description(
    "The minimal utility program for running node server as a daemon process",
  )
  .version("1.0");

// Start Command
program
  .command("start")
  .description("Start the Node.js server as a daemon process.")
  .argument("<indexFilePath>", "Path to the Node.js script to run.")
  .argument("[logFilePath]", `Path to the log file. Defaults to ${defaultLogFilePath}`)
  .action(async (indexFilePath, logFilePath) => {
    try {
      if (!isValidFilePath(indexFilePath)) {
        console.error("Invalid index file path.");
        return;
      }

      const fileExists = await isFileExist(indexFilePath);
      if (!fileExists) {
        console.error("Index file does not exist.");
        return;
      }

      if (!logFilePath) logFilePath = defaultLogFilePath;

      logger.info("Starting node server...");

      startServer(indexFilePath, logFilePath);
    } catch (error) {
      handleError(error, "Failed to start server");
    }
  });

// Stop Command
program
  .command("stop")
  .description("Stop the running Node.js server.")
  .action(() => {
    try {
      stopServer();
    } catch (error) {
      handleError(error, "Failed to stop server");
    }
  });

// Status Command
program
  .command("status")
  .description("Check the status of the Node.js server.")
  .action(() => {
    try {
      checkServerStatus();
    } catch (error) {
      handleError(error, "Failed to check status of server");
    }
  });

// Restart Command
program
  .command("restart")
  .description("Restart the running Node.js server.")
  .argument("<indexFilePath>", "Path to the Node.js script to run.")
  .argument("[logFilePath]", `Path to the log file. Defaults to ${defaultLogFilePath}`)
  .action(async (indexFilePath, logFilePath) => {
    try {
      if (!isValidFilePath(indexFilePath)) {
        console.error("Invalid index file path.");
        return;
      }

      const fileExists = await isFileExist(indexFilePath);
      if (!fileExists) {
        console.error("Index file does not exist.");
        return;
      }

      if (!logFilePath) logFilePath = defaultLogFilePath;

      logger.info("Restarting node server...");

      restartServer(indexFilePath, logFilePath);
    } catch (error) {
      handleError(error, "Failed to restart server");
    }
  });

program.parse(process.argv);
