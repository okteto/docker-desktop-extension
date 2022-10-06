FROM --platform=$BUILDPLATFORM node:17.7-alpine3.14 AS client-builder

WORKDIR /app/client

# cache packages in layer
COPY client/package.json /app/client/package.json
COPY client/yarn.lock /app/client/yarn.lock

ARG TARGETARCH
RUN yarn config set cache-folder /usr/local/share/.cache/yarn-${TARGETARCH}
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-${TARGETARCH} yarn

# install
COPY client /app/client
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-${TARGETARCH} yarn build

FROM debian:bullseye-slim

LABEL org.opencontainers.image.title="Okteto" \
    org.opencontainers.image.description="Remote Development for Docker Compose" \
    org.opencontainers.image.vendor="Okteto" \
    com.docker.desktop.extension.api.version=">= 0.2.3" \
    com.docker.desktop.extension.icon="https://www.okteto.com/okteto-symbol-circle-inverse-1.1.png" \
    com.docker.extension.detailed-description="<p>The Docker Extension for Okteto lets you deploy your containers on Okteto Cloud.</p><p>Okteto lets you:</p><ul> <li>Launch a development environment that includes both local and remote containers</li><li>Write code using your local IDE, and see the results immediately on both your local and remote containers</li><li>Share your development environments with your teammates</li><li>Automatically create a preview environment with every pull request you create</li></ul><h2>About Okteto</h2><p>Okteto is a platform that enables teams of all sizes to deploy Remote Development Environments with one click. Don&apos;t wait hours to see results by committing, deploying, and waiting for CI builds to see the results of your code changes. Okteto spins up a cloud environment to deploy your application stack where you can see your changes live, exactly as they would look in production. Today, leading tech companies like Monday.com, LaunchDarkly, Replicated, Privacy Dynamics, Sirona Medical, Dafiti, and many more are already using Okteto remote development and preview environments every day to develop amazing experiences for their customers.</p>" \
    com.docker.extension.publisher-url="https://okteto.com" \
    com.docker.extension.additional-urls="[{\"title\":\"Documentation\",\"url\":\"https://okteto.com/docs\"}, {\"title\":\"Community\",\"url\":\"https://community.okteto.com/\"}]" \
    com.docker.extension.screenshots="[{\"alt\": \"Remote and local environments in one click\", \"url\": \"https://www.okteto.com/docker-desktop-extension-marketplace-1.png\"}, {\"alt\": \"Code locally, Run remotely\", \"url\": \"https://www.okteto.com/docker-desktop-extension-marketplace-2.png\"}]"

ARG OKTETO_ARCH

COPY --from=client-builder /app/client/dist ui
COPY okteto.svg .
COPY metadata.json .

COPY ./okteto/bin/okteto-Darwin-${OKTETO_ARCH} /darwin/okteto
COPY ./okteto/bin/okteto-Linux-${OKTETO_ARCH} /linux/okteto
COPY ./okteto/bin/okteto.exe /windows/okteto.exe
