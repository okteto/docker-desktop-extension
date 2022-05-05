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

FROM golang:1.17-buster as cli-builder

WORKDIR /app/cli

RUN git clone --depth 1 --branch feature/docker-desktop --single-branch https://github.com/okteto/okteto.git
WORKDIR /app/cli/okteto
RUN make build-all

FROM debian:bullseye-slim

LABEL org.opencontainers.image.title="Okteto" \
    org.opencontainers.image.description="Remote Development for Docker Compose" \
    org.opencontainers.image.vendor="Okteto Inc" \
    com.docker.desktop.extension.api.version=">= 0.2.3" \
    com.docker.desktop.extension.icon="https://www.okteto.com/okteto-symbol-circle-inverse-1.1.png"

ARG OKTETO_ARCH

COPY --from=cli-builder /app/cli/okteto/bin/okteto-Darwin-${OKTETO_ARCH} /darwin/okteto
COPY --from=cli-builder /app/cli/okteto/bin/okteto-Linux-${OKTETO_ARCH} /linux/okteto
COPY --from=cli-builder /app/cli/okteto/bin/okteto.exe /windows/okteto.exe
COPY --from=client-builder /app/client/dist ui
COPY okteto.svg .
COPY metadata.json .
