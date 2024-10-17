package restart

import (
	"context"
	"fmt"
	"time"

	sqladmin "google.golang.org/api/sqladmin/v1beta4"
)

func InstancesRestart(ctx context.Context, service *sqladmin.Service, project, name string) error {
	op, err := service.Instances.Restart(project, name).Context(ctx).Do()
	if err != nil {
		return fmt.Errorf("restart failed: %v", err)
	}

	// Wait for operation to complete
	for op.Status != "DONE" {
		time.Sleep(2 * time.Second)
		op, err = service.Operations.Get(project, op.Name).Do()
		if err != nil {
			return fmt.Errorf("failed to get operation status: %v", err)
		}
	}

	return nil
}
