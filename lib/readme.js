const fs = require('fs-extra');
const path = require('path');

module.exports = { handleReadme };

async function handleReadme(dir, owner, repo) {
	const readmeFile = path.join(dir, 'README.md');
	const content = readmeContent(owner, repo);
	fs.unlinkSync(readmeFile);
	fs.writeFileSync(readmeFile, content);
}

function readmeContent(owner, repo) {
	return `
# ${repo}
[![Deploy to WP Engine](https://github.com/${owner}/${repo}/actions/workflows/wp-engine.yml/badge.svg)](https://github.com/${owner}/${repo}/actions/workflows/wp-engine.yml)

Short summary of the main functionality and purpose of the project.

## Domains
#### CNAME
[${repo}.wpengine.com](https://${repo}.wpengine.com)
#### WP Engine Admin
https://my.wpengine.com/installs/${repo}
## How to build
## Deployment
`;
}
