# Ping Pong Application

A simple stateless HTTP API demonstrating Kubernetes service communication and counter functionality. Introduced in exercise 1.9 and updated in 2.1 for HTTP-based inter-service communication.

## Architecture

Stateless Express.js application providing:

- **Counter API**: Maintains in-memory request counter
- **HTTP Service**: Serves counter data to other applications

## Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f manifests/

# Check deployment status  
kubectl get pods -l app=pingpong

# View application logs
kubectl logs -f deployment/pingpong-dep

# Access via ingress (if configured)
curl http://localhost:3000/pingpong
curl http://localhost:3000/counter
```

## Application Endpoints

- `GET /pingpong` - Increments counter and returns "pong X"
- `GET /counter` - Returns current counter value in format "Ping / Pongs: X"

## Configuration

The application:

- Uses no persistent storage (in-memory counter)
- Communicates via HTTP with other services
- Exposes ClusterIP service on port 2346
- Routes through shared ingress controller
