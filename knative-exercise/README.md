# Exercise 5.6: Serverless with Knative

## Overview

This directory contains the artifacts for Exercise 5.6, which involves setting up a serverless environment using Knative on a local `k3d` cluster.

## Setup Instructions

### 1. Create the Cluster

A specific `k3d` cluster configuration is required to support Knative (disabling Traefik and mapping ports).

```bash
k3d cluster create knative \
  --port "8082:30080@agent:0" \
  --port "8081:80@loadbalancer" \
  --agents 2 \
  --k3s-arg "--disable=traefik@server:0"
```

### 2. Install Knative

Using the `kn` CLI and Operator:

```bash
kn operator install
kn operator install -c serving --kourier
```

### 3. Deploy the Application

Apply the service manifest:

```bash
kubectl apply -f service.yaml
```

## Verification

### Accessing the Service

Since this is a local setup with "Magic DNS" (sslip.io), the `Host` header must be manually specified to route traffic correctly through the Kourier ingress.

**Command:**

```bash
curl -v -H "Host: hello.knative-serving.172.18.0.3.sslip.io" http://localhost:8081
```

_Note: The IP `172.18.0.3` may vary. Check `kn service describe hello -o url` to find the correct internal IP._

### Autoscaling (Scale to Zero)

1. Wait for the pod to terminate (scale to zero) after ~60 seconds of inactivity.
2. Send the `curl` request again.
3. Observe the "Cold Start" (latency) and the new pod spinning up.

### Traffic Splitting

To split traffic between revisions (e.g., "Hello World" vs "Hello Knative"):

```bash
# Update the service
kn service update hello --env TARGET=Knative

# Split traffic
kn service update hello --traffic hello-00001=50 --traffic @latest=50
```
