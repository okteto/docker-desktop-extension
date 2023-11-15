package app

import (
	"fmt"

	"github.com/okteto/docker-desktop-extension/cli/pkg/model"
)

const (
	HybridMode = "hybrid"
	OktetoHome = "$HOME/.okteto"
)

func Translate(m *model.Manifest) model.DockerContainers {
	result := model.DockerContainers{}
	for name := range m.DevContainers {
		devContainer := m.DevContainers[name]
		if devContainer.Mode != HybridMode {
			continue
		}
		docker := model.DockerContainer{}
		docker.Docker = fmt.Sprintf("docker-%s-okteto", name)
		// docker.Args = []string{
		// 	"-d",
		// 	// mount okteto home folder
		// 	"-v",
		// 	os.ExpandEnv(fmt.Sprintf("%s:/root/.okteto", OktetoHome)),
		// 	// mount okteto manifest folder
		// 	"-v",
		// 	fmt.Sprintf("%s:/okteto/src", m.Folder),
		// 	// run command
		// 	"--entrypoint",
		// 	"/root/.okteto/okteto",
		// 	devContainer.Image,
		// 	"--",
		// 	fmt.Sprintf("up -c %s -f /okteto/src/%s %s", m.Context, m.Filename, name),
		// }
		// // port-forwards
		// for _, p := range devContainer.Forward {
		// 	hostPort := strings.Split(p, ":")[0]
		// 	docker.Args = append(docker.Args, "-p", fmt.Sprintf("%s:%s", hostPort, hostPort))
		// }
		docker.Args = []string{"-d", "nginx"}

		result[name] = docker
	}
	return result
}
