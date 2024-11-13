package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"sync"

	"golang.org/x/crypto/ssh"
	"google.golang.org/api/compute/v1"
)

func main() {
	project := os.Getenv("PROJECT")
	if project == "" {
		log.Fatal("PROJECT environment variable not set")
	}

	ctx := context.Background()
	computeService, err := compute.NewService(ctx)
	if err != nil {
		log.Fatalf("Failed to create compute service: %v", err)
	}

	labelKey := os.Getenv("LABEL_KEY")
	labelValue := os.Getenv("LABEL_VALUE")
	command := os.Args[1]

	req := computeService.Instances.List(project, "your-zone").Filter(fmt.Sprintf("labels.%s=%s", labelKey, labelValue))
	it, err := req.Do()
	if err != nil {
		log.Fatalf("Failed to list instances: %v", err)
	}

	var wg sync.WaitGroup
	for _, instance := range it.Items {
		wg.Add(1)
		go func(inst *compute.Instance) {
			defer wg.Done()
			executeCommand(inst, command)
		}(instance)
	}
	wg.Wait()
}

func executeCommand(instance *compute.Instance, command string) {
	config := &ssh.ClientConfig{
		User: os.Getenv("SSH_USER"),
		Auth: []ssh.AuthMethod{
			publicKeyFile(os.Getenv("SSH_KEY_PATH")),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	address := fmt.Sprintf("%s:%d", instance.NetworkInterfaces[0].AccessConfigs[0].NatIP, 22)
	conn, err := ssh.Dial("tcp", address, config)
	if err != nil {
		log.Printf("Failed to dial SSH for instance %s: %v", instance.Name, err)
		return
	}
	defer conn.Close()

	session, err := conn.NewSession()
	if err != nil {
		log.Printf("Failed to create SSH session for instance %s: %v", instance.Name, err)
		return
	}
	defer session.Close()

	output, err := session.CombinedOutput(command)
	if err != nil {
		log.Printf("Failed to execute command on instance %s: %v", instance.Name, err)
		return
	}

	var mu sync.Mutex
	mu.Lock()
	fmt.Printf("Output from %s:\n%s\n", instance.Name, string(output))
	mu.Unlock()
}

func publicKeyFile(file string) ssh.AuthMethod {
	buffer, err := os.ReadFile(file)
	if err != nil {
		log.Fatalf("Unable to read private key: %v", err)
	}
	key, err := ssh.ParsePrivateKey(buffer)
	if err != nil {
		log.Fatalf("Unable to parse private key: %v", err)
	}
	return ssh.PublicKeys(key)
}
