const axios = require('axios');

module.exports = { addTopics };

async function addTopics(token, owner, repo) {
	const url = `https://api.github.com/repos/${owner}/${repo}/topics`;

	return await axios
		.request({
			url,
			method: 'PUT',
			user: `${owner}:${token}`,
			headers: {
				Accept: application / vnd.github.mercy - preview + json,
			},
			data: {
				names: ['site', 'wpengine', 'global-ci'],
			},
		})
		.then((result) => {
			return result;
		});
}
