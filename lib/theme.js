const path = require('path');
const rimraf = require('rimraf');
const { getAuthanticatedUrl } = require('./utils');

module.exports = { handleTheme };

async function handleTheme(token, themeUrl, dir, name, git) {
	const themeDir = path.join(dir, 'wp-content', 'themes', name);
	await git.clone(getAuthanticatedUrl(token, themeUrl), themeDir, { '--depth': 1 });
	// remove the git folder
	const gitFolder = path.join(themeDir, '.git');
	rimraf.sync(gitFolder);
}
