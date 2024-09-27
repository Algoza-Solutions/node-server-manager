#!/usr/bin/env node

const { program } = require("commander");
const { isFileExist } = require("../../util/file");
const { isValidFilePath } = require("../../util/validation");
// const { runBashScript } = require('../api/bashRunner');
const {
  startServer,
  stopServer,
  checkServerStatus,
} = require("../api/processManager");
const path = require("path");
const os = require("os");
const logger = require("../../util/logger");
const { handleError } = require("../../util/errorHandler");

// const startScriptPath = path.resolve(__dirname, '../../scripts/start.sh');
const defaultLogFilePath = path.join(os.homedir(), "node.log");

program
  .name("nsm")
  .description(
    "The minimal utility program for running node server as a daemon process",
  )
  .version("1.0");

program
  .command("start")
  .description("start a daemon")
  .argument("<indexFilePath>", "script to run")
  .argument("[logFilePath]", `log file: default is at ${defaultLogFilePath}`)
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

program.parse(process.argv);
