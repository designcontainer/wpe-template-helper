const axios = require('axios');

module.exports = { addTopics };

async function addTopics(token, owner, repo) {
	return await axios({
		method: 'put',
		url: `https://api.github.com/repos/${owner}/${repo}/topics`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Accept: 'application/vnd.github.mercy-preview+json',
		},
		auth: {
			username: owner,
			password: token,
		},
		data: {
			names: ['site', 'wpengine', 'global-ci'],
		},
	})
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
}
