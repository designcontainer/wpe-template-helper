const core = require('@actions/core');
const simpleGit = require('simple-git');
const path = require('path');
const { mkdir } = require('fs').promises;

const { clone, push, areFilesChanged } = require('./git');
const { handleNewCore } = require('./wordpress');
const { handleTheme } = require('./theme');
const { handleComposer } = require('./replacements');
const { handleReadme } = require('./readme');
const { addTopics } = require('./topics');
const { cleanup } = require('./cleanup');

const triggerEventName = process.env.GITHUB_EVENT_NAME;
const eventPayload = require(process.env.GITHUB_EVENT_PATH);

async function run() {
	if (triggerEventName !== 'push')
		return core.setFailed('This GitHub Action works only when triggered by "push".');

	core.debug('DEBUG: full payload of the event that triggered the action:');
	core.debug(JSON.stringify(eventPayload, null, 2));

	try {
		// Action inputs
		// Required
		const gitHubKey = core.getInput('github_token', { required: true });
		const themeRepo = core.getInput('theme_repo', { required: true });
		const workflowFile = core.getInput('workflow_file', { required: true });
		// Optional
		const topicsToSet = core.getInput('topics_to_set');
		const committerUsername = core.getInput('committer_username');
		const committerEmail = core.getInput('committer_email');
		const commitMessage = core.getInput('commit_message');
		// Envs
		const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
		const branch = process.env.GITHUB_REF;
		// Other
		const repoUrl = `https://github.com/${owner}/${repo}`;
		const themeUrl = `https://github.com/${themeRepo}`;

		/**
		 * Start initialization by creating a working dir.
		 */
		core.startGroup('Started initialization');
		core.info('Create working dir');
		const dir = path.join(process.cwd(), './clone', repo);
		await mkdir(dir, { recursive: true });
		core.endGroup();

		/**
		 * Clone working repo.
		 */
		core.startGroup(`Clone ${repo} by ${owner}`);
		const git = simpleGit({ baseDir: dir });
		await clone(gitHubKey, repoUrl, dir, git);
		core.endGroup();

		/**
		 * Download the latest WordPress core.
		 */
		core.startGroup('Download latest WordPress');
		await handleNewCore(dir);
		core.endGroup();

		/**
		 * Download the latest starter theme.
		 */
		core.startGroup('Download the latest starter theme');
		await handleTheme(gitHubKey, themeUrl, dir, repo, git);
		core.endGroup();

		/**
		 * Modifying composer.json
		 */
		core.startGroup('Modifying composer.json');
		await handleComposer(dir, repo);
		core.endGroup();

		/**
		 * Create a readme.md
		 */
		core.startGroup('Create a readme.md');
		await handleReadme(dir, owner, repo);
		core.endGroup();

		/**
		 * Add topics
		 */
		if  ( topicsToSet.length ) {
			core.startGroup('Add topics');
			await addTopics(gitHubKey, owner, repo, topicsToSet);
			core.endGroup();
		}
		
		/**
		 * Remove this workflow.
		 */
		core.startGroup('Removing this workflow');
		await cleanup(dir, workflowFile);
		core.endGroup();

		/**
		 * Commit and push all changes to repo.
		 */
		core.startGroup('Push to repo');
		if (await areFilesChanged(git)) {
			await push(
				gitHubKey,
				repoUrl,
				branch,
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
