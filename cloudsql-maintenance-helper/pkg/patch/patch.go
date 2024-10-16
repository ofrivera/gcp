package patch

import (
	"context"
	"fmt"
	"time"

	"google.golang.org/api/sql/v1beta4"
)

func PatchInstance(ctx context.Context, service *sql.Service, project, name string) error {
	patchReq := &sql.DatabaseInstance{
		Settings: &sql.Settings{
			ActivationPolicy: "ALWAYS",
		},
	}
	op, err := service.Instances.Patch(project, name, patchReq).Context(ctx).Do()
	if err != nil {
		return fmt.Errorf("patch failed: %v", err)
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
