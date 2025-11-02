# Log Output Application

A microservice application demonstrating Kubernetes logging, HTTP APIs, multi-container pods, and service communication. Evolved through exercises 1.1, 1.3, 1.7, 1.10, and 2.1.

## Architecture

The application consists of two microservices:

- **log-writer**: Generates timestamped log entries with UUID every 5 seconds
- **log-reader**: Serves HTTP API combining log data with external service data

## Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f manifests/

# Check deployment status
kubectl get pods -l app=log-output

# View logs
kubectl logs -f deployment/log-output -c log-reader
kubectl logs -f deployment/log-output -c log-writer

# Access the API (requires ingress)
curl http://localhost:3000/status
```

## Application Endpoints

- `GET /` - Redirects to `/status`
- `GET /status` - Returns combined timestamp and counter data

## Configuration

The application uses:

- Shared volume for inter-container communication
- HTTP requests for external service communication
- ClusterIP service for internal networking
- Ingress for external access
