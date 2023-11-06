FROM --platform=$BUILDPLATFORM node:18-alpine AS client-builder

ARG TARGETARCH

WORKDIR /app/client

# cache packages in layer
COPY client/package.json /app/client/package.json
COPY client/yarn.lock /app/client/yarn.lock

RUN yarn config set cache-folder /usr/local/share/.cache/yarn-${TARGETARCH}
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-${TARGETARCH} yarn

# install
COPY client /app/client
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-${TARGETARCH} yarn build

FROM curlimages/curl as okteto-binaries

ARG OKTETO_ARCH
ARG OKTETO_VERSION

RUN curl -sLf --retry 3 -o okteto-Darwin-${OKTETO_ARCH} https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto-Darwin-${OKTETO_ARCH}
RUN curl -sLf --retry 3 -o okteto-Linux-${OKTETO_ARCH} https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto-Linux-${OKTETO_ARCH}
RUN curl -sLf --retry 3 -o okteto.exe https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto.exe

FROM debian:bullseye-slim

ARG OKTETO_ARCH

LABEL org.opencontainers.image.title="Okteto" \
    org.opencontainers.image.description="Hybrid Development for Docker Compose and Kubernetes" \
    org.opencontainers.image.vendor="Okteto" \
    com.docker.desktop.extension.api.version=">= 0.2.3" \
    com.docker.desktop.extension.icon="https://www.okteto.com/okteto-symbol-circle-inverse-1.1.png" \
    com.docker.extension.detailed-description="<p>The Docker Extension for Okteto lets you create hybrid development environments.</p><p>Okteto lets you:</p><ul> <li>Launch a development environment that includes both local and remote containers</li><li>Write code using your local IDE, and see the results immediately on both your local and remote containers</li><li>Share your development environments with your teammates</li><li>Automatically create a preview environment with every pull request you create</li></ul><h2>About Okteto</h2><p>Okteto is a platform that enables teams of all sizes to deploy Remote Development Environments with one click. Don&apos;t wait hours to see results by committing, deploying, and waiting for CI builds to see the results of your code changes. Okteto spins up a cloud environment to deploy your application stack where you can see your changes live, exactly as they would look in production. Today, leading tech companies like Monday.com, LaunchDarkly, Replicated, Privacy Dynamics, Sirona Medical, Dafiti, and many more are already using Okteto remote development and preview environments every day to develop amazing experiences for their customers.</p>" \
    com.docker.extension.publisher-url="https://okteto.com" \
    com.docker.extension.additional-urls="[{\"title\":\"Documentation\",\"url\":\"https://okteto.com/docs\"}, {\"title\":\"Community\",\"url\":\"https://community.okteto.com/\"}]" \
    com.docker.extension.screenshots="[{\"alt\": \"Remote and local environments in one click\", \"url\": \"https://www.okteto.com/docker-desktop-extension-marketplace-1.png\"}, {\"alt\": \"Code locally, Run remotely\", \"url\": \"https://www.okteto.com/docker-desktop-extension-marketplace-2.png\"}]"

COPY --from=client-builder /app/client/dist ui
COPY okteto.svg .
COPY metadata.json .

COPY --from=okteto-binaries --chmod=755 /home/curl_user/okteto-Darwin-${OKTETO_ARCH} /darwin/okteto
COPY --from=okteto-binaries --chmod=755 /home/curl_user/okteto-Linux-${OKTETO_ARCH} /linux/okteto
COPY --from=okteto-binaries --chmod=755 /home/curl_user/okteto.exe /windows/okteto.exe
