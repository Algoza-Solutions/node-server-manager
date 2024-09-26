#!/usr/bin/env node

const { program } = require('commander');
const { isFileExist } = require('../../util/file');
const { isValidFilePath } = require('../../util/validation');
const { runBashScript } = require('../api/bashRunner');
const path = require('path');
const os = require('os');

const startScriptPath = path.resolve(__dirname, '../../scripts/start.sh');
const defaultLogFilePath = path.join(os.homedir(), 'node.log');

program
    .name('nsm')
    .description('The minimal utility program for running node server as a daemon process')
    .version('1.0');

program.command('start')
    .description('start a daemon')
    .argument('<indexFilePath>', 'script to run')
    .argument('[logFilePath]', `log file: default is at ${defaultLogFilePath}`)
    .action(async (indexFilePath, logFilePath) => {
        if (!isValidFilePath(indexFilePath)) {
            console.error('Invalid index file path.');
            return;
          }
        const response = await isFileExist(indexFilePath);
        if (!logFilePath)
            logFilePath = defaultLogFilePath;

        if (response) {
            runBashScript(startScriptPath, [indexFilePath, logFilePath]);
        }
    });

program.parse();
