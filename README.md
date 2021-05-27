# WPE Template helper
This action handler installation of WordPress and further setup of the [WPE Template](https://github.com/designcontainer/wpe-template)

## Workflow steps
1. Get the latest version of WordPress.
2. Get the specified theme and place it in the themes folder.
3. Set the correct repository name in `composer.json`.
4. Add the specified topics.
5. Delete this action from repository.
## Supported Event Triggers

This action can be triggered by:
- **push** After this action has been triggered, it will get deleted from the repo.
## Configuration

Name | Description | Required | Default
--|------|--|--
github_token | Token to use GitHub API. It must have "repo" and "workflow" scopes so it can push to repo and edit workflows. Provide token of the user who has the right to push to the repos that this action is supposed to update. The same token is used for pulling repositories - important to know for those that want to use this action with private repositories. | true | -
workflow_file | The name of this workflow file (including extension) | true | -
theme_repo | The repo for your starter theme In the format `designcontainer/dc-skeleton`. | true | -
topics_to_set | A list of topics to set for the repository in the format `topic1,topic2`. | false | -
committer_username | The username (not display name) of the committer will be used to commit changes in the workflow file in a specific repository. In the format `web-flow`. | false | `web-flow`
committer_email | The committer's email that will be used in the commit of changes in the workflow file in a specific repository. In the format `noreply@github.com`.| false | `noreply@github.com`
commit_message | It is used as a commit message when pushing changes with global workflows. It is also used as a title of the pull request that is created by this action. | false | `Initialize new template`