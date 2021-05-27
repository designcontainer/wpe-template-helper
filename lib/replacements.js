const path = require('path');
const replace = require('replace');

module.exports = { handleComposer };

async function handleComposer(dir, repo) {
	const composerFile = path.join(dir, 'composer.json');

	replace({
		regex: 'replace_with_repo_name',
		replacement: repo,
		paths: composerFile,
		recursive: false,
		silent: false,
	});
}
