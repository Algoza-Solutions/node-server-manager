const fs = require('fs').promises;
const path = require('path');

const isFileExist = async (fileName) => {
    const filePath = path.join(process.cwd(), fileName);
    console.log(filePath)
    try {
        await fs.access(filePath, fs.constants.F_OK);
        console.log(`${fileName} exists.`);
        return true;
    } catch (err) {
        console.log(`${fileName} does not exist.`);
        return false;
    }

};

module.exports = { isFileExist };
