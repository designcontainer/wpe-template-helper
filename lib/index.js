const core = require('@actions/core');
const simpleGit = require('simple-git');
const path = require('path');
const { mkdir } = require('fs').promises;

const { clone, push, areFilesChanged, getBranches } = require('./git');
const { handleNewCore } = require('./wordpress');

const triggerEventName = process.env.GITHUB_EVENT_NAME;
const eventPayload = require(process.env.GITHUB_EVENT_PATH);

async function run() {
	if (triggerEventName !== 'create')
		return core.setFailed('This GitHub Action works only when triggered by "create".');

	core.debug('DEBUG: full payload of the event that triggered the action:');
	core.debug(JSON.stringify(eventPayload, null, 2));

	try {
		const gitHubKey =
			process.env.GITHUB_TOKEN || core.getInput('github_token', { required: true });
		const committerUsername = core.getInput('committer_username');
		const committerEmail = core.getInput('committer_email');
		const commitMessage = core.getInput('commit_message');

		const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

		core.startGroup('Started initialization');
		// Create working dir
		const dir = path.join(process.cwd(), './clone', repo);
		await mkdir(dir, { recursive: true });
		// Clone repo
		const git = simpleGit({ baseDir: dir });
		await clone(gitHubKey, repo.url, dir, git);
		// Download latest WordPress
		await handleNewCore(dir);
		// Push
		if (await areFilesChanged(git)) {
			const repoUrl = `git@github.com:${owner}/${repo}.git`;
			const branches = await getBranches(git);
			await push(
				gitHubKey,
				repoUrl,
				branches[0],
				commitMessage,
				committerUsername,
				committerEmail,
				git
			);
		}

		core.endGroup();
	} catch (error) {
		core.setFailed(`Action failed because of: ${error}`);
	}
}

run();
