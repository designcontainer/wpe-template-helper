const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const anzip = require('anzip');
const rimraf = require('rimraf');

const { getAuthanticatedUrl } = require('./utils');

module.exports = { handleTheme };

async function handleTheme(token, themeUrl, dir, git) {
	const themes = path.join(dir, 'wp-content', 'themes');

	await git.clone(getAuthanticatedUrl(token, themeUrl), themes, { '--depth': 1 });
}
