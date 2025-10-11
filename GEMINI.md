# Gemini Project Context: DevOps with Kubernetes Exercises

## Project Overview

This repository contains the exercises for the "DevOps with Kubernetes" course from the University of Helsinki. It's a monorepo containing several small Node.js applications designed to be containerized with Docker and deployed to Kubernetes.

The project is structured into multiple subdirectories, each representing a microservice or a part of an exercise:

- **`log_output`**: A multi-container pod application with a `log-writer` that generates timestamps and a `log-reader` that serves them via a web server. They communicate through a shared persistent volume.
- **`pingpong`**: A simple web server that increments a counter stored in a PostgreSQL database. It demonstrates the use of StatefulSets and Services.
- **`todo_app`**: A frontend application for a TODO list. It communicates with the `todo-backend` API and also fetches and displays a daily image from an external service, demonstrating Persistent Volumes for caching.
- **`todo-backend`**: A backend API for the TODO list application, backed by a PostgreSQL database. It includes a CronJob for periodic tasks.
- **`cluster-admin`**: Contains administrative Kubernetes manifests, such as Namespaces.

The primary technologies used are:

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Building and Running

Each application follows a similar pattern for building and deployment.

### Building Docker Images

Each application directory (`log_output/log-reader`, `log_output/log-writer`, `pingpong`, `todo_app`, `todo-backend`) contains a `Dockerfile`. To build the Docker image for an application, navigate to its directory and run:

```sh
# Example for the pingpong app
docker build -t your-docker-hub-username/pingpong:latest .
```

### Running Applications Locally

Each application is a Node.js project and can be started locally using `npm`.

```sh
# Example for the pingpong app
cd pingpong
npm install
npm start
```

### Deploying to Kubernetes

The `manifests` subdirectory within each application folder contains the necessary Kubernetes YAML files. To deploy an application, use `kubectl apply`.

```sh
# Example for deploying the pingpong application and its database
kubectl apply -f pingpong/manifests/statefulset.yaml
kubectl apply -f pingpong/manifests/postgres-service.yaml
kubectl apply -f pingpong/manifests/deployment.yaml
kubectl apply -f pingpong/manifests/service.yaml
```

The applications are typically deployed into the `exercises` or `project` namespaces, as defined in the manifest files.

## Development Conventions

- **Code Style**: The code is written in JavaScript (Node.js) using the Express.js framework. There are no enforced code style rules, linters, or formatters configured in the project.
- **Configuration**: Applications are configured using environment variables, which are injected into the Kubernetes pods via `ConfigMaps`. This is a standard cloud-native practice.
- **Persistence**: Data persistence is achieved using PostgreSQL databases (for `pingpong` and `todo-backend`) and Persistent Volumes for file-based caching (in `todo_app` and `log_output`).
- **Networking**: Services are exposed within the cluster using `ClusterIP` or `NodePort` services, and to the outside world using `Ingress`.
