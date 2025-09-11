# Todo App

Frontend web application with image caching and todo functionality. Works with todo-backend microservice.

## Local Development

```bash
npm install
npm start  # Runs on port 3000
```

## Docker

```bash
docker build -t aljazkovac/todo-app .
docker run -p 3000:8080 aljazkovac/todo-app
```

## Kubernetes

```bash
kubectl apply -f manifests/
```

Access at `http://localhost:3000/`

## Features

- Todo form with character validation
- Random image caching from Lorem Picsum
- Communicates with todo-backend service
- Persistent storage for images
