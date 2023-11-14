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

package model

import (
	"os"

	yaml "gopkg.in/yaml.v2"
)

// Manifest represents an okteto manifest
type Manifest struct {
	DevContainers map[string]DevContainer `json:"dev,omitempty" yaml:"dev,omitempty"`
}

// Dev represents a development container
type DevContainer struct {
	Name      string            `json:"name,omitempty" yaml:"name,omitempty"`
	Selector  map[string]string `json:"selector,omitempty" yaml:"selector,omitempty"`
	Container string            `json:"container,omitempty" yaml:"container,omitempty"`
	Image     string            `json:"image,omitempty" yaml:"image,omitempty"`
	Sync      []string          `json:"sync,omitempty" yaml:"sync,omitempty"`
	Forward   []string          `json:"forward,omitempty" yaml:"forward,omitempty"`
	Volumes   []string          `json:"volumes,omitempty" yaml:"volumes,omitempty"`
}

// Get returns a Dev object from a given file
func Get(manifestPath string) (*Manifest, error) {
	b, err := os.ReadFile(manifestPath)
	if err != nil {
		return nil, err
	}

	result := &Manifest{}
	if err := yaml.Unmarshal(b, result); err != nil {
		return nil, err
	}

	return result, nil
}
