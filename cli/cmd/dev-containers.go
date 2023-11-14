// Copyright 2024 The Okteto Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cmd

import (
	"fmt"

	"github.com/okteto/docker-desktop-extension/cli/pkg/model"

	"github.com/spf13/cobra"
)

// DevContainersOpts represents the options available on up command
type DevContainersOpts struct {
	ManifestPath string
	Namespace    string
	K8sContext   string
}

// DevContainers shows the devcontainers in an okteto manifest with the transformations needed by the docker extension
func DevContainers() *cobra.Command {
	// ctx := context.Background()
	devContainersOpts := &DevContainersOpts{}
	cmd := &cobra.Command{
		Use:   "devcontainers",
		Short: "Shows the devcontainers in an okteto manifest",
		RunE: func(cmd *cobra.Command, args []string) error {
			// manifestOpts := contextCMD.ManifestOptions{Filename: devContainersOpts.ManifestPath, Namespace: devContainersOpts.Namespace, K8sContext: devContainersOpts.K8sContext}
			m, err := model.Get(devContainersOpts.ManifestPath)
			// oktetoManifest, err := contextCMD.LoadManifestWithContext(ctx, manifestOpts)
			if err != nil {
				return err
			}

			if len(m.DevContainers) == 0 {
				return fmt.Errorf("okteto manifest has no 'dev' section")
			}

			fmt.Println(len(m.DevContainers))

			// c, err = okteto.GetK8sClient()
			// if err != nil {
			// 	return fmt.Errorf("failed to load okteto context '%s': %v", devContainersOpts.K8sContext, err)
			// }

			return nil
		},
	}

	cmd.Flags().StringVarP(&devContainersOpts.ManifestPath, "file", "f", "", "path to the okteto manifest file")
	cmd.Flags().StringVarP(&devContainersOpts.Namespace, "namespace", "n", "", "namespace where the command is executed")
	cmd.Flags().StringVarP(&devContainersOpts.K8sContext, "context", "c", "", "context where the command is executed")
	return cmd
}
