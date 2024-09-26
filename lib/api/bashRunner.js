const { execFile } = require('child_process');

const runBashScript = (scriptPath, args, parser = null) => {
  try {
    execFile('bash', [scriptPath, ...args], (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`bash error: ${stderr}`);
        return;
      }

      if (parser) {
        parser(stdout);
      } else {
        console.log(stdout);
      }
    });
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
  }
};

module.exports = { runBashScript };
