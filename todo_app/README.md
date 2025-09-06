# TODO Application

A full-featured web application demonstrating Kubernetes deployments, persistent storage, image caching, and user input functionality. Evolved through exercises 1.2, 1.4, 1.5, 1.6, 1.8, 1.12, and 1.13.

## Architecture

Express.js web application featuring:

- **HTML Interface**: Interactive todo form with input validation
- **Image Caching**: Hourly updated random images from Lorem Picsum 
- **Persistent Storage**: Image cache survives pod restarts
- **Input Validation**: Character limits and user feedback

## Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f manifests/

# Check deployment status
kubectl get pods -l app=todo-app

# View application logs
kubectl logs -f deployment/todo-app

# Access via ingress (if configured)
curl http://localhost:3000/
```

## Application Endpoints

- `GET /` - Main TODO interface with image and form
- `GET /image` - Serves cached random image
- `POST /` - Todo form submission (placeholder functionality)

## Configuration

The application uses:

- Persistent volume for image caching (`/app/images`)
- ClusterIP service on port 2345
- Ingress controller for external access  
- Resource limits for optimal performance
