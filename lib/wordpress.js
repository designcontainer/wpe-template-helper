const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const anzip = require('anzip');
const rimraf = require('rimraf');

module.exports = { handleNewCore };

/**
 * Handles the install and setup of the wordpress core.
 *
 * @async
 * @param {string} workingPath The working path.
 */
async function handleNewCore(workingPath) {
	const coreCompressed = await downloadCore(workingPath);
	const corePath = await extractCore(coreCompressed, workingPath);
	await moveCore(corePath, workingPath);
}

/**
 * Downloads a new core zip file from Wordpress.org.
 *
 * @async
 * @param {string} workingPath The working path.
 * @return {string} Returns a string with the zip file path.
 */
async function downloadCore(workingPath) {
	const url = 'https://wordpress.org/latest.zip';
	const file = path.join(workingPath, 'core.zip');

	return await axios
		.request({
			url,
			method: 'GET',
			responseType: 'arraybuffer',
		})
		.then((result) => {
			fs.writeFileSync(file, result.data);
			return file;
		});
}

/**
 * Extracts the core zip file and removes the unneccesary files and folders.
 *
 * @async
 * @param {string} zip The zip file.
 * @param {string} outputPath Where the zip should get extracted to.
 * @return {string} Returns a string with the core folder path.
 */
async function extractCore(zip, outputPath) {
	// Unzip file
	await anzip(zip, { outputPath });
	// Remove zip file
	fs.unlinkSync(zip);
	// The zip contents path
	const corePath = path.join(outputPath, 'wordpress');

	return corePath;
}

/**
 * Moves the new core to the install directory.
 *
 * @async
 * @param {string} corePath The core folder path.
 * @param {string} outputPath Where the core should be moved.
 */
async function moveCore(corePath, workingPath) {
	fs.copySync(corePath, workingPath);
	rimraf.sync(corePath);
}
