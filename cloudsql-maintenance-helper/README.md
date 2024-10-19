# CloudSQL Patch

## Overview

`cloudsql-patch` is a tool to concurrently apply patches to multiple Google Cloud SQL instances.

## Setup

1. **Configure Instances:**
   Rename `config/instances.example.yaml` to `config/instances.yaml` and update with your instances' details.
   Structure
   ```bash
   instances:
   - project: "project-id"
      zone: "us-central1"
      name: "instance-name-1"
   - project: "project-id"
      zone: "us-central1"
      name: "instance-name-2"
   ```

2. **Set Environment Variables:**
   Create a `.env` file in the root directory with the following:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
   ```

3. **Install Dependencies:**
   ```bash
   go mod tidy
   ```

4. **Usage**
   Run the application using:
   ```bash
   go run cmd/main.go
   ```
