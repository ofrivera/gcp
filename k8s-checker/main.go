package main

import (
	"context"
	"flag"
	"fmt"
	"path/filepath"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

func main() {
	var kubeconfig *string
	if home := homedir.HomeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	// Build the Kubernetes client configuration
	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err.Error())
	}

	// Create the Kubernetes client
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	// Get the list of pods
	pods, err := clientset.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		panic(err.Error())
	}

	// Create a map to group pod by Status
	podStatus := make(map[string][]string)

	// Print the pod details
	fmt.Println("Pods per Status:")
	for _, pod := range pods.Items {
		podStatus[string(pod.Status.Phase)] = append(podStatus[string(pod.Status.Phase)], pod.Name)
	}

	// Print the total number of pods per status
	for status, pods := range podStatus {
		fmt.Printf("Status: %s, Count: %d\n", status, len(pods))
	}

	// Print the total number of pods per node
	nodePods := make(map[string]int)
	for _, pod := range pods.Items {
		nodePods[pod.Spec.NodeName]++
	}

	fmt.Println("Pods per Node:")
	for node, count := range nodePods {
		fmt.Printf("Node: %s, Count: %d\n", node, count)
	}
}
