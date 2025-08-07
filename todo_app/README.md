# TODO App - Exercise 1.2

A simple web server application built with Express.js for Kubernetes deployment exercises.

## Application Features

- Simple web server that responds with "Hello from TODO app!"
- Configurable port via PORT environment variable (defaults to 3000)
- Logs startup message: "Server started in port NNNN"
- Health endpoint available at `/`

## Local Development

### Prerequisites

- Node.js 18+ installed
- npm package manager

### Running Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the application:

   ```bash
   npm start
   ```

3. Or run directly with Node.js:

   ```bash
   node app.js
   ```

4. Test with custom port:

   ```bash
   PORT=8080 node app.js
   ```

5. Access the application:

   ```bash
   http://localhost:3000 (or your custom port)
   ```

## Docker Deployment

### Build Docker Image

```bash
docker build -t todo-app .
```

### Run Docker Container

```bash
# Default port (3000)
docker run -p 3000:3000 todo-app

# Custom port
docker run -p 8080:8080 -e PORT=8080 todo-app
```

### Push to Docker Hub

```bash
# Tag the image
docker tag todo-app your-dockerhub-username/todo-app:latest

# Login to Docker Hub
docker login

# Push the image
docker push your-dockerhub-username/todo-app:latest
```

## Kubernetes Deployment

### Requirements

- Kubernetes cluster running (e.g., k3d)
- kubectl configured
- Docker image pushed to registry

### Deploy to Kubernetes

1. Create deployment:

   ```bash
   kubectl create deployment todo-app --image=your-dockerhub-username/todo-app:latest
   ```

2. Check deployment status:

   ```bash
   kubectl get pods
   kubectl get deployments
   ```

3. View application logs:

   ```bash
   kubectl logs deployment/todo-app
   ```

### Configuration

#### Set Environment Variables

```bash
# Set custom port
kubectl set env deployment/todo-app PORT=8080

# View current environment variables
kubectl describe deployment todo-app
```

#### Restart Deployment

```bash
# Restart all pods (zero-downtime restart)
kubectl rollout restart deployment/todo-app

# Check rollout status
kubectl rollout status deployment/todo-app
```

#### Scale Application

```bash
# Scale to multiple replicas
kubectl scale deployment todo-app --replicas=3

# Check pod distribution
kubectl get pods -o wide
```

### Useful Commands

```bash
# Get pod details
kubectl describe pod <pod-name>

# Get deployment details
kubectl describe deployment todo-app

# Delete deployment
kubectl delete deployment todo-app

# Check deployment history
kubectl rollout history deployment/todo-app
```

### Debug Commands

```bash
# Stream logs in real-time
kubectl logs -f deployment/todo-app

# Get pod shell access (for debugging)
kubectl exec -it <pod-name> -- /bin/sh

# Check pod network information
kubectl get pods -o wide

# Watch pod status changes
kubectl get pods -w
```

## Exercise Requirements Met

✅ **Web server creation**: Express.js server responds to HTTP requests  
✅ **Port configuration**: Uses PORT environment variable with default 3000  
✅ **Startup logging**: Displays "Server started in port NNNN" message  
✅ **Docker containerization**: Dockerfile for containerized deployment  
✅ **Kubernetes deployment**: Successfully deploys to k3d cluster  
✅ **Environment variables**: Demonstrates PORT variable configuration in Kubernetes
