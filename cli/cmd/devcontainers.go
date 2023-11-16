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
	"encoding/json"
	"fmt"
	"os"

	"github.com/okteto/docker-desktop-extension/cli/pkg/app"
	"github.com/okteto/docker-desktop-extension/cli/pkg/model"

	"github.com/spf13/cobra"
)

// DevContainersOpts represents the options available on up command
type DevContainersOpts struct {
	ManifestPath string
	Context      string
}

// DevContainers shows the devcontainers in an okteto manifest with the transformations needed by the docker extension
func DevContainers() *cobra.Command {
	manifestPath := ""
	cmd := &cobra.Command{
		Use:   "devcontainers",
		Short: "Shows the devcontainers in an okteto manifest",
		RunE: func(cmd *cobra.Command, args []string) error {
			if manifestPath == "" {
				return fmt.Errorf("the flag '-f' is mandatory")
			}
			m, err := model.Get(manifestPath)
			if err != nil {
				return err
			}

			dockers := app.Translate(m)

			bytes, err := json.MarshalIndent(dockers, "", "    ")
			if err != nil {
				return err
			}
			jsonOutput := string(bytes)
			if jsonOutput == "null" {
				jsonOutput = "[]"
			}
			fmt.Fprint(os.Stdout, jsonOutput)

			return nil
		},
	}

	cmd.Flags().StringVarP(&manifestPath, "file", "f", "", "path to the okteto manifest file")
	return cmd
}
