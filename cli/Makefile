BINDIR    := $(CURDIR)/bin
PLATFORMS := linux/amd64/okteto-extension-Linux-amd64 darwin/amd64/okteto-extension-Darwin-amd64 windows/amd64/okteto-extension.exe linux/arm64/okteto-extension-Linux-arm64 darwin/arm64/okteto-extension-Darwin-arm64
BUILDCOMMAND := go build -trimpath -ldflags "-s -w"
temp = $(subst /, ,$@)
os = $(word 1, $(temp))
arch = $(word 2, $(temp))
label = $(word 3, $(temp))

UNAME := $(shell uname)
ifeq ($(UNAME), Darwin)
SHACOMMAND := shasum -a 256
else
SHACOMMAND := sha256sum
endif

.DEFAULT_GOAL := build

.PHONY: release
release: $(PLATFORMS)

$(PLATFORMS):
	GOOS=$(os) GOARCH=$(arch) CGO_ENABLED=0 $(BUILDCOMMAND) -o "bin/$(label)"
	$(SHACOMMAND) "bin/$(label)" > "bin/$(label).sha256"

.PHONY: test
test:
	go test -p 4 -coverprofile=coverage.txt -covermode=atomic ./...

.PHONY: build
build:
	$(BUILDCOMMAND) -o ${BINDIR}/okteto-extension
