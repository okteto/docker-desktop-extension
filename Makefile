IMAGE?=okteto/docker-desktop-extension
TAG?=dev
OKTETO_VERSION?=2.21.0

BUILDER=buildx-multi-arch

STATIC_FLAGS=CGO_ENABLED=0
LDFLAGS="-s -w"
GO_BUILD=$(STATIC_FLAGS) go build -trimpath -ldflags=$(LDFLAGS)

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m

install-extension: ## Install the extension
	docker extension install $(IMAGE):$(TAG)

update-extension: ## Update the extension
	docker extension update $(IMAGE):$(TAG)

validate-extension: ## Validate the extension
	docker extension validate metadata.json

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

build-extension: prepare-buildx ## Build extension image but do not push
	docker buildx build --platform=linux/arm64 --build-arg TAG=$(TAG) --build-arg OKTETO_ARCH=arm64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} .
	docker buildx build --platform=linux/amd64 --build-arg TAG=$(TAG) --build-arg OKTETO_ARCH=x86_64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} .

push-extension: prepare-buildx ## Build & Upload extension image to hub. Do not push if tag already exists: make push-extension tag=0.1
	docker buildx build --push --platform=linux/arm64 --build-arg TAG=$(TAG) --build-arg OKTETO_ARCH=arm64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} --tag=$(IMAGE):$(TAG) .
	docker buildx build --push --platform=linux/amd64 --build-arg TAG=$(TAG) --build-arg OKTETO_ARCH=x86_64 --build-arg OKTETO_VERSION=${OKTETO_VERSION} --tag=$(IMAGE):$(TAG) .

help: ## Show this help
	@echo Please specify a build target. The choices are:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(NO_COLOR) %s\n", $$1, $$2}'

.PHONY: bin extension push-extension help
