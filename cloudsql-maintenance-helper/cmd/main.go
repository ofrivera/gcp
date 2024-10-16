package main

import (
	"context"
	"log"
	"os"
	"sync"

	"io/ioutil"
	"path/filepath"

	"google.golang.org/api/option"
	"google.golang.org/api/sql/v1beta4"
	"gopkg.in/yaml.v3"

	"sql-patch-app/pkg/patch"

	"github.com/joho/godotenv"
)

type InstanceConfig struct {
	Instances []struct {
		Project string `yaml:"project"`
		Zone    string `yaml:"zone"`
		Name    string `yaml:"name"`
	} `yaml:"instances"`
}

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Load instances from YAML file
	configPath := filepath.Join("config", "instances.yaml")
	configFile, err := ioutil.ReadFile(configPath)
	if err != nil {
		log.Fatalf("Failed to read config file: %v", err)
	}

	var instanceConfig InstanceConfig
	if err := yaml.Unmarshal(configFile, &instanceConfig); err != nil {
		log.Fatalf("Failed to parse config file: %v", err)
	}

	// Initialize the Google SQL Admin API client
	ctx := context.Background()
	service, err := sql.NewService(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		log.Fatalf("Error creating SQL service: %v", err)
	}

	// Concurrently patch all instances
	var wg sync.WaitGroup
	for _, instance := range instanceConfig.Instances {
		wg.Add(1)
		go func(project, zone, name string) {
			defer wg.Done()
			err := patch.PatchInstance(ctx, service, project, name)
			if err != nil {
				log.Printf("Failed to patch instance %s: %v", name, err)
			} else {
				log.Printf("Successfully patched instance %s", name)
			}
		}(instance.Project, instance.Zone, instance.Name)
	}

	wg.Wait()
	log.Println("Finished patching all instances.")
}
