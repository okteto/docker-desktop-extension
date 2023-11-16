package app

import (
	"github.com/okteto/docker-desktop-extension/cli/pkg/model"
)

func Translate(m *model.Manifest) model.DockerContainers {
	result := model.DockerContainers{}
	for name := range m.DevContainers {
		result = append(result, name)
	}
	return result
}
