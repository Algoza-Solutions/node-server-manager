const { exec } = require('child_process');

const runBashScript = (scriptPath, args, parser = null) => {
    try {
        exec(`bash ${scriptPath} ${args.join(' ')}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`bash error: ${stderr}`);
                return;
            }

            if (parser)
                parser(stdout);
            else
                console.log(`LOG: ${stdout}`);
        });
    } catch (error) {
        console.error(error);
    }
    return;
};

module.exports = { runBashScript };
