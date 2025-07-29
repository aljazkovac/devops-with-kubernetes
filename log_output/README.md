# Exercise 1.1 - Log Output Application

A simple Node.js application that generates a unique UUID on startup and outputs a timestamp with that UUID every 5 seconds.

## Application Behavior

- Generates a unique UUID when the application starts
- Outputs the startup message with the UUID
- Every 5 seconds, prints a timestamp followed by the same UUID
- Runs continuously until stopped

## Prerequisites

- Node.js 18+ (for local development)
- Docker (for containerized deployment)
- kubectl and Kubernetes cluster (for Kubernetes deployment)

## Running the Application

### Method 1: Local Development with Node.js

```bash
# Install dependencies (if any are added in the future)
npm install

# Run the application
node app.js

# Or use npm script
npm start
```

**Expected Output:**

```
Application started with ID: 550e8400-e29b-41d4-a716-446655440000
2025-07-29 14:30:15: 550e8400-e29b-41d4-a716-446655440000
2025-07-29 14:30:20: 550e8400-e29b-41d4-a716-446655440000
2025-07-29 14:30:25: 550e8400-e29b-41d4-a716-446655440000
...
```

### Method 2: Docker Container

```bash
# Build the Docker image
docker build -t log-output .

# Run the container
docker run log-output

# Run in detached mode (background)
docker run -d --name log-output-container log-output

# View logs of background container
docker logs -f log-output-container

# Stop the container
docker stop log-output-container
```

### Method 3: Kubernetes Deployment

```bash
# Create a Kubernetes deployment
kubectl create deployment log-output --image=aljazkovac/kubernetes-1-1

# Check if the deployment is running
kubectl get pods

# View the application logs
kubectl logs -f deployment/log-output

# Scale to multiple replicas
kubectl scale deployment log-output --replicas=3

# View logs from all pods with pod names
kubectl logs -f -l app=log-output --prefix=true
```

## Docker Hub

The containerized application is available on Docker Hub:
**https://hub.docker.com/r/aljazkovac/kubernetes-1-1**

## Files

- `app.js` - Main Node.js application
- `package.json` - Node.js project configuration
- `Dockerfile` - Docker container configuration
- `README.md` - This documentation

## Key Learning Points

- Each Kubernetes pod runs independently with its own UUID
- Container images should use specific tags for production deployments
- Alpine Linux base images provide smaller container sizes
- Kubernetes deployments can be scaled horizontally with `kubectl scale`

## Stopping the Application

- **Local**: Press `Ctrl+C`
- **Docker**: `docker stop <container-name>`
- **Kubernetes**: `kubectl delete deployment log-output`
