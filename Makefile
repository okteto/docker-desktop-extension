IMAGE?=okteto/docker-desktop-extension
TAG?=0.1.17

BUILDER=buildx-multi-arch

STATIC_FLAGS=CGO_ENABLED=0
LDFLAGS="-s -w"
GO_BUILD=$(STATIC_FLAGS) go build -trimpath -ldflags=$(LDFLAGS)

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m

install-plugin: ## Install docker extensions plugin
	curl -sLf --retry 3 -o desktop-extension-cli-linux-amd64.tar.gz https://github.com/docker/extensions-sdk/releases/download/v0.2.4/desktop-extension-cli-linux-amd64.tar.gz
	tar -xvzf desktop-extension-cli-linux-amd64.tar.gz
	mkdir -p ~/.docker/cli-plugins
	mv docker-extension ~/.docker/cli-plugins

install-extension: ## Install the extension
	docker extension install $(IMAGE):$(TAG)

update-extension: ## Update the extension
	docker extension update $(IMAGE):$(TAG)

validate-extension: ## Validate the extension
	docker extension validate metadata.json

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

extension: prepare-buildx ## Build & Upload extension image to hub. Do not push if tag already exists: make push-extension tag=0.1
	docker pull $(IMAGE):$(TAG) && echo "Failure: Tag already exists" || docker buildx build --push --builder=$(BUILDER) --platform=linux/amd64,linux/arm64 --build-arg TAG=$(TAG) --tag=$(IMAGE):$(TAG) .

help: ## Show this help
	@echo Please specify a build target. The choices are:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(NO_COLOR) %s\n", $$1, $$2}'

.PHONY: bin extension push-extension help
