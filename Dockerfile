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

ENV OKTETO_VERSION=2.2.0

LABEL org.opencontainers.image.title="Okteto" \
    org.opencontainers.image.description="Remote Development for Docker Compose" \
    org.opencontainers.image.vendor="Okteto Inc" \
    com.docker.desktop.extension.api.version=">= 0.2.3" \
    com.docker.desktop.extension.icon="https://www.okteto.com/okteto-symbol-circle-inverse-1.1.png"

ARG TARGETARCH

RUN apt update -y && apt install curl -y
RUN mkdir /darwin
RUN if [ "${TARGETARCH}" = "amd64" ] ; then curl -sLf --retry 3 -o /darwin/okteto https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto-Darwin-x86_64 ; fi
RUN if [ "${TARGETARCH}" = "arm64" ] ; then curl -sLf --retry 3 -o /darwin/okteto https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto-Darwin-arm64 ; fi
RUN chmod +x /darwin/okteto
RUN mkdir /windows && \
    curl -sLf --retry 3 -o /windows/okteto.exe https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto.exe
RUN mkdir /linux
RUN if [ "${TARGETARCH}" = "amd64" ] ; then curl -sLf --retry 3 -o /linux/okteto https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto-Linux-x86_64 ; fi
RUN if [ "${TARGETARCH}" = "arm64" ] ; then curl -sLf --retry 3 -o /linux/okteto https://github.com/okteto/okteto/releases/download/${OKTETO_VERSION}/okteto-Linux-arm64 ; fi
RUN chmod +x /linux/okteto

COPY --from=client-builder /app/client/dist ui
COPY okteto.svg .
COPY metadata.json .
