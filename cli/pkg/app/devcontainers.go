package app

import (
	"strings"

	"github.com/okteto/docker-desktop-extension/cli/pkg/model"
)

func Translate(m *model.Manifest) model.DockerContainers {
	result := model.DockerContainers{}
	for name := range m.DevContainers {
		result = append(result, name)
	}
	for name := range m.Services {
		found := false
		for _, v := range m.Services[name].Volumes {
			if strings.Contains(v, ":") {
				found = true
				break
			}
		}
		if found {
			result = append(result, name)
		}
	}
	return result
}
