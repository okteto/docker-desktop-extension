# Contributing to Docker Extension for Okteto

Thank you for showing interest in contributing to the Docker Extension for Okteto!
We appreciate all kinds of contributions, suggestions, and feedback.

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report any unacceptable behavior to hello@okteto.com.

## Ways To Contribute

### Reporting Issues

Reporting issues is a great way to help the project! This isn't just limited to reporting bugs but can also include feature requests or suggestions for improvements in current behavior. We use [GitHub issues](https://github.com/okteto/docker-desktop-extension/issues) for tracking all such things. But if you want to report a sensitive security issue or a security exploit, you can directly contact the project maintainers on hello@okteto.com or via [a Twitter DM](https://twitter.com/oktetoHQ).

### Contributing Code

When contributing features or bug fixes to the Docker Extension for Okteto, it'll be helpful to keep the following things in mind:

- Communicating your changes before you start working
- Including unit tests whenever relevant
- Making sure your code passes the [lint checks](#linting)
- Signing off on all your git commits by running `git commit -s`
- Documenting all functions in your code

Discussing your changes with the maintainers before implementation is one of the most important steps, as this sets you in the right direction before you begin. The best way to communicate this is through a detailed GitHub issue.

#### Making a Pull Request

The following steps will walk you through the process of opening your first pull request:

##### Fork the Repository

Head over to the project repository on GitHub and click the **"Fork"** button. This allows you to work on your own copy of the project without being affected by the changes on the main repository. Once you've forked the project, clone it using:

```
git clone https://github.com/YOUR-USERNAME/docker-desktop-extension.git
```

##### Create a Branch

Creating a new branch for each feature/bugfix on your project fork is recommended. You can do this using:

```
git checkout -b <branch-name>
```

##### Commit and Push Your Changes

Once you've made your changes, you can stage them using:

```
git add .
```

After that, you'll need to commit them. For contributors to certify that they wrote or otherwise have the right to submit the code they are contributing to the project, we require them to acknowledge this by signing their work, which indicates they agree to the DCO found [here](https://developercertificate.org/).

To sign your work, just add a line like this at the end of your commit message:

```
Signed-off-by: Cindy Lopez <cindy.lopez@okteto.com>
```

This can easily be done with the `-s' command-line option to append this automatically to your commit message.

```
git commit -s -m 'Meaningful commit message'
```

> In order to use the `-s` flag for auto signing the commits, you'll need to set your `user.name`and`user.email` git configs

Finally, you can push your changes to GitHub using:

```
git push origin <branch-name>
```

Once you do that and visit the repository, you should see a button on the GitHub UI prompting you to make a PR.

## Development Guide

### Install extension

```console
make install-extension
```

### Update extension

```console
make update-extension
```

### Developing with hot reload

If you are working on the frontend code of your extension and don't want to rebuild the extension image each time you can setup Docker Desktop in a way that will use your development server instead of the bundled frontend code from the extension image.

To do that, in one terminal start your UI development server:

```console
cd client
yarn start
```

This will start a development server that listens on port 3000. You can now tell Docker Desktop to use this as the frontend source, in another terminal run:

```console
docker extension dev ui-source okteto/docker-desktop-extension http://localhost:3000
```

Close and reopen the Docker Desktop dashboard and go to your extension, all the changes to the frontend code will now be immediately visible.

Once you are done you can remove the ui-source override by running:

```console
docker extension dev reset okteto/docker-desktop-extension
```

### Testing

Unit tests for the project can be executed by running:

```console
cd client
yarn test
```

## Release

```console
make extension
```