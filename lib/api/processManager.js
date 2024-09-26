const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const startServer = (scriptPath, logFilePath) => {
  const absoluteScriptPath = path.resolve(scriptPath);
  const absoluteLogFilePath = logFilePath
    ? path.resolve(logFilePath)
    : path.join(os.homedir(), 'node.log');

  // Check if server is already running
  if (isServerRunning(absoluteScriptPath)) {
    console.log('Node server is already running.');
    return;
  }

  // Start the server
  const out = fs.openSync(absoluteLogFilePath, 'a');
  const err = fs.openSync(absoluteLogFilePath, 'a');

  const child = spawn('node', [absoluteScriptPath], {
    detached: true,
    stdio: ['ignore', out, err],
  });

  child.unref();

  // Save PID to a file for later use
  savePid(child.pid);

  console.log(`Node server started with PID ${child.pid}.`);
  console.log(`Log file is at ${absoluteLogFilePath}`);
};

const savePid = (pid) => {
  const pidFile = path.join(os.homedir(), '.nsm', 'pid');
  fs.mkdirSync(path.dirname(pidFile), { recursive: true });
  fs.writeFileSync(pidFile, pid.toString(), 'utf8');
};

const isServerRunning = (scriptPath) => {
  // Implement logic to check if the server is running
  // For example, read the PID file and check if the process is active
  return false;
};

const getPid = () => {
    const pidFile = path.join(os.homedir(), '.nsm', 'pid');
    if (fs.existsSync(pidFile)) {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10);
      return pid;
    }
    return null;
  };
  
  const stopServer = () => {
    const pid = getPid();
    if (pid) {
      try {
        process.kill(pid);
        fs.unlinkSync(path.join(os.homedir(), '.nsm', 'pid'));
        console.log(`Node server with PID ${pid} has been stopped.`);
      } catch (error) {
        console.error(`Failed to stop server: ${error.message}`);
      }
    } else {
      console.log('No running server found.');
    }
  };
  
  module.exports = { startServer, stopServer };
  
