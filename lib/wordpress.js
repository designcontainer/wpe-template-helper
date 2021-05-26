const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const anzip = require('anzip');
const rimraf = require('rimraf');

module.exports = { handleNewCore };

/**
 * Handles the install and setup of the wordpress core.
 *
 * @param {string} workingPath The working path.
 */
handleNewCore = async (workingPath) => {
	const coreCompressed = await this.downloadCore(workingPath);
	const corePath = await this.extractCore(coreCompressed, workingPath);
	await this.moveCore(corePath, workingPath);
};

/**
 * Downloads a new core zip file from Wordpress.org.
 *
 * @param {string} workingPath The working path.
 * @return {string} Returns a string with the zip file path.
 */
downloadCore = async (workingPath) => {
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
};

/**
 * Extracts the core zip file and removes the unneccesary files and folders.
 *
 * @param {string} zip The zip file.
 * @param {string} outputPath Where the zip should get extracted to.
 * @return {string} Returns a string with the core folder path.
 */
extractCore = async (zip, outputPath) => {
	// Unzip file
	await anzip(zip, { outputPath });
	// Remove zip file
	fs.unlinkSync(zip);
	// The zip contents path
	const corePath = path.join(outputPath, 'wordpress');
	// Remove the wp-content folder
	rimraf.sync(path.join(corePath, 'wp-content'));

	return corePath;
};

/**
 * Moves the new core to the install directory.
 *
 * @param {string} corePath The core folder path.
 * @param {string} outputPath Where the core should be moved.
 */
moveCore = async (corePath, workingPath) => {
	fs.copySync(corePath, workingPath);
	rimraf(corePath, (error) => {
		if (error) throw new Error(error);
	});
};
