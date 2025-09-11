# Todo Backend

REST API service for managing todos.

## Local Development

```bash
npm install
npm start  # Runs on port 3001
```

## Docker

```bash
docker build -t aljazkovac/todo-backend .
docker run -p 3001:3001 aljazkovac/todo-backend
```

## Kubernetes

```bash
kubectl apply -f manifests/
```

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create todo (requires `{"text": "..."}`)
