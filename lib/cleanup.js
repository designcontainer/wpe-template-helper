const path = require('path');
const rimraf = require('rimraf');

module.exports = { cleanup };

async function cleanup(dir, workflow) {
	const thisWorkflow = path.join(dir, '.github', 'workflows', workflow);
	rimraf.sync(thisWorkflow);
}
