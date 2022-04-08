# docker-desktop-extension

Okteto extension for Docker Desktop

# Prerequisites

- Install https://desktop-stage.docker.com/mac/main/arm64/75296/Docker.dmg
- Install docker extensions

#### Mac  (intel)

```
tar -xvzf desktop-extension-cli-darwin-amd64.tar.gz
mkdir -p ~/.docker/cli-plugins
mv docker-extension ~/.docker/cli-plugins
```

```
docker extension enable
```

#### Mac (arm)

```
tar -xvzf desktop-extension-cli-darwin-arm64.tar.gz
mkdir -p ~/.docker/cli-plugins
mv docker-extension ~/.docker/cli-plugins
```

```
docker extension enable
```

# Release

```
make extension
```

# Install extension

```
make install-extension
```

# Update extension

```
make update-extension
```

# Developing with hot reload

If you are working on the frontend code of your extension and don't want to rebuild the extension image each time you can setup Docker Desktop in a way that will use your development server instead of the bundled frontend code from the extension image.

To do that, in one terminal start your UI development server:

```
cd client
yarn start
```

This will start a development server that listens on port 3000. You can now tell Docker Desktop to use this as the frontend source, in another terminal run:

```
docker extension dev ui-source okteto/docker-desktop-extension http://localhost:3000
```

Close and reopen the Docker Desktop dashboard and go to your extension, all the changes to the frontend code will now be immediately visible.

Once you are done you can remove the ui-source override by running:

```
docker extension dev reset okteto/docker-desktop-extension
```
