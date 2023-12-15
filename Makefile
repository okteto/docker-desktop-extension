IMAGE?=okteto/docker-desktop-extension
TAG?=dev
OKTETO_VERSION?=2.23.1

BUILDER=buildx-multi-arch

STATIC_FLAGS=CGO_ENABLED=0
LDFLAGS="-s -w"
GO_BUILD=$(STATIC_FLAGS) go build -trimpath -ldflags=$(LDFLAGS)

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m

install-extension: ## Install the extension
	docker extension install $(IMAGE):$(TAG)

update-extension: ## Update the extension
	docker pull $(IMAGE):$(TAG)
	docker extension update $(IMAGE):$(TAG)

validate-extension: ## Validate the extension
	docker extension validate metadata.json

build-cli:
	cd cli && make release

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

build-extension: build-cli prepare-buildx ## Build extension image but do not push
	docker build --platform=linux/arm64 --build-arg OKTETO_ARCH=arm64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} .
	docker build --platform=linux/amd64 --build-arg OKTETO_ARCH=x86_64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} .

push-extension: build-cli prepare-buildx ## Build & Upload extension image to hub
	docker build --push --platform=linux/arm64 --build-arg OKTETO_ARCH=arm64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} -t=$(IMAGE):$(TAG)-arm64 .
	docker build --push --platform=linux/amd64 --build-arg OKTETO_ARCH=x86_64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} -t=$(IMAGE):$(TAG)-amd64 .
	docker buildx imagetools create -t $(IMAGE):$(TAG) $(IMAGE):$(TAG)-arm64 $(IMAGE):$(TAG)-amd64

develop:
	docker extension dev ui-source $(IMAGE) http://localhost:3000

help: ## Show this help
	@echo Please specify a build target. The choices are:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(NO_COLOR) %s\n", $$1, $$2}'

.PHONY: bin extension push-extension help
