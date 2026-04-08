# ☸️ Kubernetes Microservices Architecture & Optimization Guide

This document provides a comprehensive overview of the Kubernetes-optimized architecture for the **Nexus Gaming Hub** microservice application.

---

## 🏗️ Architecture Overview

The application follows a standard microservices pattern, decoupled for high availability and scalability within a Kubernetes cluster.

### Component Map
- **Frontend**: A React/Vite SPA served by an optimized Nginx container.
- **Auth Service**: Node.js service handling user registration and JWT-based authentication.
- **Product Service**: Node.js service managing the gaming product catalog.
- **Order Service**: Node.js service for processing and retrieving purchase history.
- **Database**: A single MongoDB instance managing three logical databases (Auth, Products, Orders).

---

## 🛠️ Kubernetes Resource Reference

All manifests are located in the [`/k8s`](file:///c:/Users/Lavi%20Singodiya/Downloads/K8s/microserviceApp/k8s/) directory.

| Resource Name | Type | Purpose | Key Configurations |
| :--- | :--- | :--- | :--- |
| `mongodb` | Deployment/SVC | Persistence | PVC for data storage, internal DNS `mongodb` |
| `auth-service` | Deployment/SVC | Backend | Port 5001, 2 Replicas, Secrets for JWT |
| `product-service` | Deployment/SVC | Backend | Port 5002, 2 Replicas, ConfigMap for DB |
| `order-service` | Deployment/SVC | Backend | Port 5003, 2 Replicas, ConfigMap for DB |
| `frontend` | Deployment/SVC | UI | Port 80, Nginx with Gzip & SPA routing |
| `microservice-ingress`| Ingress | Routing | Routes `/api/*` and `/` traffic |
| `microservice-config` | ConfigMap | Environment | Shared DB names and Port mappings |
| `microservice-secrets`| Secret | Security | Base64 encoded `JWT_SECRET` |

---

## 🚀 Deployment Workflow

### 1. Build and Push (CI/CD)
Ensure your Docker images are built with the optimized multi-stage Dockerfiles and pushed to your registry:
```powershell
./dockerbuild.ps1
```

### 2. Initial Setup
Apply the configuration and security layers first:
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
```

### 3. Deploy Stack
Deploy the database and all microservices:
```bash
kubectl apply -f k8s/
```

---

## 🛡️ Best Practices Applied

The following optimizations have been implemented to ensure a production-ready environment:

### 1. Security (Zero Trust & Least Privilege)
- **Non-Root Containers**: All services run as a non-privileged `node` user.
- **Secrets Management**: Sensitive data is decoupled from the code and injected as environment variables from K8s Secrets.
- **Ownership**: Docker images use `--chown=node:node` to prevent permission escalations.

### 2. Reliability (Self-Healing)
- **Liveness Probes**: Automatically restarts containers if the app hangs (detected via `/health`).
- **Readiness Probes**: Ensures a pod only receives traffic once its MongoDB connection and server are fully established.
- **Graceful Shutdown**: Node.js services catch `SIGTERM` to finish current requests before shutting down, preventing 502 errors during updates.
- **High Availability**: Critical services use `replicas: 2` to survive individual pod failures.

### 3. Performance (Efficiency)
- **Resource Limits**: Every container has `cpu` and `memory` requests/limits defined, preventing "noisy neighbor" issues.
- **Nginx Tuning**: Frontend serves assets with Gzip compression and long-term caching headers for static files.
- **Ingress Annotations**: Tuned for 10MB payload sizes and 60s timeouts.

---

## 🔍 Troubleshooting & Monitoring

### Check Pod Status
```bash
kubectl get pods
```

### View Live Logs
```bash
kubectl logs -f deployment/auth-service
```

### Describe a Resource (to see errors)
```bash
kubectl describe pod <pod-name>
```

### Test Internal Connectivity
You can exec into a pod to test if it can reach the database:
```bash
kubectl exec -it <pod-name> -- curl http://mongodb:27017
```

---

## 📈 Future Scaling
- **HPA**: You can now easily add a `HorizontalPodAutoscaler` since we have defined resource requests.
- **Cluster Autoscaler**: These manifests are compatible with Cloud-provider (EKS/GKE/AKS) autoscalers.
