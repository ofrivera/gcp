# Kubernetes Checker

This Go script provides a simple way to check the status of pods and nodes in a Kubernetes cluster. It uses the official Kubernetes Go client library to interact with the cluster and retrieve information.

## Features

- Lists all pods in the cluster grouped by their status (e.g., Running, Pending, Failed)
- Displays the total count of pods for each status
- Shows the distribution of pods across nodes in the cluster

## Prerequisites

- Go 1.22 or later
- Access to a Kubernetes cluster
- Properly configured kubeconfig file

## Usage

1. Ensure your kubeconfig file is set up correctly (usually located at `~/.kube/config`)
2. Run the script:

   ```
   go run main.go
   ```

   Or, if you want to specify a custom kubeconfig file:

   ```
   go run main.go --kubeconfig=/path/to/your/kubeconfig
   ```

## Output

The script will display two main sections:

1. Pods per Status: Shows the count of pods in each status (e.g., Running, Pending, Failed)
2. Pods per Node: Displays the number of pods running on each node in the cluster

   ```bash
   Pods per Status:
   Status: Running, Count: 141
   Status: Pending, Count: 1
   Status: Succeeded, Count: 5
   Pods per Node:
   Node: gke-cluster-1-default-8994ddf6-1sqj, Count: 45
   Node: gke-cluster-1-default-89941dzh-ccpv, Count: 42
   Node: gke-cluster-1-default-89983c82-hq7n, Count: 44
   Node: gke-cluster-1-default-8994ddf6-wp48, Count: 16
   ```   

## Note

This script retrieves information from all namespaces in the cluster. Make sure you have the necessary permissions to access this information.
