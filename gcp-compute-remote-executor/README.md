# GCP Instance Command Executor

This Go script allows you to execute a command on multiple Google Cloud Platform (GCP) instances filtered by project and labels.

## Prerequisites

- Go 1.22 or later
- GCP project with Compute Engine API enabled
- SSH access to the instances
- Google Cloud SDK installed and configured

## Setup

1. Clone this repository
2. Set up your environment variables (see `.env.example`)
3. Install dependencies:


## Usage

Run the script with the command you want to execute as an argument:

```bash
go run main.go "ls -l /"
```

## How it works

1. The script uses GCP's Compute Engine API to list instances in your project that match the specified label.
2. It then establishes an SSH connection to each matching instance.
3. The provided command is executed on each instance.
4. The output from each instance is printed to the console.

## Environment Variables

- `PROJECT`: Your GCP project ID
- `LABEL_KEY`: The label key to filter instances
- `LABEL_VALUE`: The label value to filter instances
- `SSH_USER`: The SSH user for connecting to instances
- `SSH_KEY_PATH`: Path to your SSH private key file

## Notes

- Ensure your GCP credentials are properly set up.
- The script uses the default zone. Modify the `your-zone` in the code if needed.
- Be cautious when running commands on multiple instances simultaneously.

