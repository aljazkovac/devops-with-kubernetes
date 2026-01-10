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

## Exercise 5.7: Serverless Deployment (Knative)

To run the application as a serverless workload using Knative:

### 1. Prerequisites

Ensure the database and secrets are deployed in the `exercises` namespace, as the serverless app relies on them:

```bash
kubectl create namespace exercises
kubectl apply -f manifests/configmap.yaml -n exercises
kubectl apply -f manifests/postgres-service.yaml -n exercises
kubectl apply -f manifests/statefulset.yaml -n exercises
```

### 2. Deploy Serverless Service

Apply the Knative Service manifest:

```bash
kubectl apply -f manifests/knative-service.yaml
```

### 3. Accessing the Service

Check the status and URL of the service:

```bash
kubectl get ksvc -n exercises
```

**Linux:**
You can typically access the URL directly if your routing is configured correctly.

**macOS / Windows (Docker Desktop):**
The generated URL (e.g., `http://ping-pong-serverless...`) resolves to an internal VM IP. To access it, you must tunnel through the Ingress Gateway:

1. Start a port-forward in a separate terminal:

   ```bash
   kubectl port-forward -n kourier-system service/kourier 8080:80
   ```

2. Access via localhost using the Host header (replace the URL with the one from `kubectl get ksvc`):

   ```bash
   curl -H "Host: ping-pong-serverless.exercises.172.18.0.3.sslip.io" http://localhost:8080
   ```
