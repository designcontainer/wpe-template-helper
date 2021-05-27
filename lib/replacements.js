const path = require('path');
const replace = require('replace-in-file');

module.exports = { handleComposer };

async function handleComposer(dir, repo) {
	const composerFile = path.join(dir, 'composer.json');
	const options = {
		files: composerFile,
		from: /replace_with_repo_name/g,
		to: repo,
	};
	await replace(options);
}
