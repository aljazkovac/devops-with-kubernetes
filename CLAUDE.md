# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains exercises from the University of Helsinki's "DevOps with Kubernetes" course. Each exercise demonstrates different Kubernetes concepts through containerized Node.js applications with complete deployment manifests.

## Project Structure

The repository is organized into three main application directories:

- **`todo_app/`** - Express.js web application with image caching, persistent storage, and full Kubernetes deployment
- **`pingpong/`** - Simple Express.js counter API that persists state to shared volumes  
- **`log_output/`** - Split into `log-writer/` and `log-reader/` microservices demonstrating inter-pod communication
- **`cluster-admin/`** - Contains cluster-level persistent volume configurations

## Common Development Commands

### Local Development

```bash
# Run any Node.js application locally
cd [app_directory]
npm start

# For todo_app specifically (runs on port 3000 by default)
cd todo_app
node app.js

# For pingpong (runs on port 9000 by default) 
cd pingpong
npm start

# For log services
cd log_output/log-writer
npm start  # Port 3001
```

### Docker Operations

```bash
# Build application images
docker build -t [app-name] .

# Common image names used in this repository:
docker build -t aljazkovac/todo-app .
docker build -t aljazkovac/kubernetes-1-1 .
docker build -t aljazkovac/pingpong .
```

### Kubernetes Deployment

```bash
# Deploy applications using manifests
kubectl apply -f [app_directory]/manifests/

# Common deployment commands:
kubectl apply -f todo_app/manifests/
kubectl apply -f pingpong/manifests/
kubectl apply -f log_output/manifests/

# View logs from deployments
kubectl logs -f deployment/[deployment-name]
kubectl logs -f deployment/todo-app
kubectl logs -f deployment/pingpong

# Check persistent volumes
kubectl get pv
kubectl get pvc
```

## Architecture Patterns

### Container Strategy

All applications use **multi-stage builds** with `node:22-alpine` base images for minimal container sizes. Each Dockerfile follows the pattern:

1. Copy package files first for dependency caching
2. Install only production dependencies with `npm install --only=production`
3. Copy application code
4. Expose appropriate ports
5. Use `npm start` as the entry point

### State Management Patterns

- **File-based persistence**: Applications use `/shared` volumes for inter-pod communication (pingpong, log-writer)
- **Persistent volumes**: todo_app uses PVC-mounted `/app/images` directory for image storage
- **State restoration**: Applications read existing state on startup (counter values, cached data)

### Service Communication

The repository demonstrates three communication patterns:

1. **HTTP APIs**: todo_app serves web interface and image endpoints
2. **Shared volumes**: pingpong writes counter state, log services share log files via `/shared` mount
3. **File-based messaging**: log-writer creates log files that log-reader can access

### Resource Configuration

All deployments include production-ready resource specifications:

```yaml
resources:
  requests:
    cpu: "100m" 
    memory: "128Mi"
  limits:
    cpu: "250m"
    memory: "256Mi"
```

## Kubernetes Manifest Patterns

### Deployment Structure

Each application follows consistent manifest organization:

- `deployment.yaml` - Contains pod template, image references, volume mounts, and resource limits
- `service.yaml` - ClusterIP services exposing internal ports
- `ingress.yaml` - HTTP routing rules (where external access needed)
- `persistent-volume*.yaml` - Storage configurations for stateful applications

### Volume Mount Strategy

- **Shared storage**: `/shared` path used for inter-service file sharing
- **Application data**: `/app/images` for todo_app's image cache
- **Persistent claims**: Named volumes like `image-storage-pvc` mounted to specific paths

### Image Policies

All deployments use `imagePullPolicy: Always` to ensure latest container versions are pulled during updates.

## Exercise Navigation

The repository tracks course progress through Git branches and tags. Each exercise (1.1, 1.2, etc.) corresponds to specific Kubernetes concepts:

- **1.1-1.3**: Basic deployments and logging
- **1.4-1.6**: Services and networking  
- **1.7-1.8**: Ingress and external access
- **1.9-1.10**: Multi-container applications and volume sharing
- **1.11-1.12**: Persistent storage and stateful applications

## Development Notes

### Port Conventions

- `todo_app`: 3000 (local) / 8080 (container)
- `pingpong`: 9000 (both local and container)  
- `log-writer`: 3001
- `log-reader`: 3002

### Docker Hub Images

Applications are published to Docker Hub under the `aljazkovac/` namespace with descriptive tags matching exercise numbers.

### Custom Claude Code Commands

Custom slash commands are defined in `.claude/commands/` and provide repository-specific workflows:

#### `/plan-exercise [exerciseNumber, exerciseInstructions]`

Creates a new branch and plans the execution of the exercise.

#### `/write-post`

Switches to the aljazkovac.github.io repo, creates a new branch and writes a post about the completed exercise.
