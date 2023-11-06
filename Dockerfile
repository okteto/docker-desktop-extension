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
    org.opencontainers.image.description="Hybrid Development made Simple" \
    org.opencontainers.image.vendor="Okteto" \
    com.docker.desktop.extension.api.version=">= 0.2.3" \
    com.docker.desktop.extension.icon="https://www.okteto.com/okteto-symbol-circle-inverse-1.1.png" \
    com.docker.extension.detailed-description="Seamlessly combine Docker Desktop's local containers with cloud-based Kubernetes clusters and experiment the future of cloud-native development" \
    com.docker.extension.publisher-url="https://okteto.com" \
    com.docker.extension.additional-urls="[{\"title\":\"Documentation\",\"url\":\"https://okteto.com/docs\"}, {\"title\":\"Community\",\"url\":\"https://community.okteto.com/\"}]" \
    com.docker.extension.screenshots="[{\"alt\": \"Hybrid Development made Simple\", \"url\": \"https://www.okteto.com/docker-desktop-extension-marketplace-1.png\"}, {\"alt\": \"Hybrid Development for Docker Compose and Kubernetes\", \"url\": \"https://www.okteto.com/docker-desktop-extension-marketplace-2.png\"}]"

COPY --from=client-builder /app/client/dist ui
COPY okteto.svg .
COPY metadata.json .

COPY --from=okteto-binaries --chmod=755 /home/curl_user/okteto-Darwin-${OKTETO_ARCH} /darwin/okteto
COPY --from=okteto-binaries --chmod=755 /home/curl_user/okteto-Linux-${OKTETO_ARCH} /linux/okteto
COPY --from=okteto-binaries --chmod=755 /home/curl_user/okteto.exe /windows/okteto.exe
