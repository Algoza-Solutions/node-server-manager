const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn, execSync } = require("child_process");
const { isFileExist } = require("../../util/file");

const getPidFilePath = () => {
  return path.resolve(os.homedir(), ".nsm", "pid");
};

/**
 * Checks if a process with the given PID is running.
 * @param {number} pid - The Process ID.
 * @returns {boolean} - True if the process is running, false otherwise.
 */
const isProcessRunning = (pid) => {
  try {
    if (process.platform === "win32") {
      // On Windows, use tasklist to check if the process is running
      // Removed /NH as it's invalid with /FO LIST
      const output = execSync(`tasklist /FI "PID eq ${pid}" /FO LIST`, {
        encoding: "utf8",
      });
      return output.includes(`${pid}`);
    } else {
      // On Unix-like systems, try sending signal 0
      process.kill(pid, 0);
      return true;
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

/**
 * Starts the Node.js server as a daemon process.
 * @param {string} scriptPath - The path to the Node.js script to run.
 * @param {string} [logFilePath] - The path to the log file. Defaults to '~/node.log'.
 */
const startServer = (scriptPath, logFilePath) => {
  const absoluteScriptPath = path.resolve(scriptPath);
  const absoluteLogFilePath = logFilePath
    ? path.resolve(logFilePath)
    : path.join(os.homedir(), "node.log");

  // Check if server is already running
  if (isServerRunning()) {
    console.log("Node server is already running.");
    return;
  }

  // Start the server
  const out = fs.openSync(absoluteLogFilePath, "a");
  const err = fs.openSync(absoluteLogFilePath, "a");

  const child = spawn("node", [absoluteScriptPath], {
    detached: true,
    stdio: ["ignore", out, err],
  });

  child.unref();

  // Save PID to a file for later use
  savePid(child.pid);

  console.log(`Node server started with PID ${child.pid}.`);
  console.log(`Log file is at ${absoluteLogFilePath}`);
};

/**
 * Saves the PID of the running server to a PID file.
 * @param {number} pid - The Process ID to save.
 */
const savePid = (pid) => {
  const pidDir = path.join(os.homedir(), ".nsm");
  const pidFile = path.join(pidDir, "pid");

  // Ensure the PID directory exists
  if (!fs.existsSync(pidDir)) {
    fs.mkdirSync(pidDir, { recursive: true });
  }

  fs.writeFileSync(pidFile, pid.toString(), "utf8");
};

/**
 * Checks if the Node.js server is currently running.
 * @returns {boolean} - True if running, false otherwise.
 */
const isServerRunning = () => {
  const pidFile = getPidFilePath();

  if (fs.existsSync(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, "utf8"), 10);

    if (isNaN(pid)) {
      console.error("PID file contains invalid PID.");
      return false;
    }

    if (isProcessRunning(pid)) {
      console.log(`Server is running with PID ${pid}.`);
      return true;
    } else {
      console.log("Server is not running.");
      // Clean up the PID file since the process is not running
      fs.unlinkSync(pidFile);
      return false;
    }
  } else {
    console.log("PID file does not exist. Server is not running.");
    return false;
  }
};

/**
 * Stops the running Node.js server daemon process.
 */
const stopServer = () => {
  const pidFile = getPidFilePath();

  if (isFileExist(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, "utf8"), 10);

    if (isNaN(pid)) {
      console.error("PID file contains invalid PID.");
      return;
    }

    if (isProcessRunning(pid)) {
      try {
        if (process.platform === "win32") {
          // Use taskkill to terminate the process on Windows
          execSync(`taskkill /PID ${pid} /T /F`, {
            encoding: "utf8",
          });
        } else {
          process.kill(pid, "SIGTERM"); // Graceful termination
        }
        console.log(`Server with PID ${pid} has been stopped.`);
      } catch (error) {
        console.error(`Failed to stop server: ${error.message}`);
        return;
      }
    } else {
      console.log("Server is not running.");
    }

    // Remove the PID file
    fs.unlinkSync(pidFile);
  } else {
    console.log("No PID file found. Server is not running.");
  }
};

/**
 * Restarts the running Node.js server daemon process.
 * Stops the server if it's running and then starts it again.
 * @param {string} scriptPath - The path to the Node.js script to run.
 * @param {string} [logFilePath] - The path to the log file. Defaults to '~/node.log'.
 */
const restartServer = (scriptPath, logFilePath) => {
  try {
    stopServer();
    // Add a slight delay to ensure the process has terminated
    setTimeout(() => {
      startServer(scriptPath, logFilePath);
    }, 1000);
  } catch (error) {
    console.error(`Failed to restart server: ${error.message}`);
  }
};

/**
 * Checks the status of the Node.js server.
 */
const checkServerStatus = () => {
  const pidFile = getPidFilePath();

  if (isFileExist(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, "utf8"), 10);

    if (isNaN(pid)) {
      console.error("PID file contains invalid PID.");
      return;
    }

    if (isProcessRunning(pid)) {
      console.log(`Server is running with PID ${pid}.`);
    } else {
      console.log("Server is not running.", pid);
      // Clean up the PID file since the process is not running
      fs.unlinkSync(pidFile);
    }
  } else {
    console.log("Server is not running.", pidFile);
  }
};

module.exports = {
  startServer,
  stopServer,
  checkServerStatus,
  restartServer,
  isServerRunning,
};
