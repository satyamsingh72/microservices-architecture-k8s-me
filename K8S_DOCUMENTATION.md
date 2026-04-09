# ☸️ Kubernetes Deployment Guide — kubeadm on EC2

Full production-ready reference for the **Nexus Gaming Hub** microservice application deployed on a self-managed kubeadm cluster running on AWS EC2.

---

## 🏗️ Architecture Overview

```
Internet
    │
    ▼  port 30080 (EC2 Security Group open)
EC2 Public IP
    │
    ▼
nginx Ingress Controller  (NodePort: 30080)
    │
    ├── /api/auth/*      → auth-service:5001   (ClusterIP, 2 replicas)
    ├── /api/products/*  → product-service:5002 (ClusterIP, 2 replicas)
    ├── /api/orders/*    → order-service:5003   (ClusterIP, 2 replicas)
    └── /*               → frontend:80          (ClusterIP, 2 replicas)
                                │
                                ▼  nginx proxies /api/* to backends
                          React SPA (nginx)
                                │
                       K8s internal DNS
                                │
                                ▼
                         mongodb:27017  (ClusterIP, 1 replica)
                                │
                         PVC → PV → /data/mongodb
                         (hostPath on EC2 node disk)
```

---

## 📁 Manifest Reference

| File | Kind | Purpose |
|:---|:---|:---|
| `configmap.yaml` | ConfigMap | Shared env vars — Mongo host/port, full per-service `MONGO_URI` |
| `secrets.yaml` | Secret | `JWT_SECRET` (base64 encoded) |
| `pv.yaml` | PersistentVolume | Static hostPath PV on EC2 node, with `nodeAffinity` |
| `mongodb.yaml` | PVC + Deployment + Service | MongoDB with `storageClassName: manual`, `Recreate` strategy |
| `auth-service.yaml` | Deployment + Service | Auth API port 5001, 2 replicas, reads `MONGO_URI` from ConfigMap |
| `product-service.yaml` | Deployment + Service | Product API port 5002, 2 replicas, reads `MONGO_URI` from ConfigMap |
| `order-service.yaml` | Deployment + Service | Order API port 5003, 2 replicas, reads `MONGO_URI` from ConfigMap |
| `frontend.yaml` | Deployment + Service | React SPA via nginx, port 80, 2 replicas, ClusterIP |
| `ingress-nginx-patch.yaml` | Service (patch) | Fixes ingress controller to NodePort **30080** (HTTP) / **30443** (HTTPS) |
| `ingress.yaml` | Ingress | Routes all traffic to correct services |

---

## 🚀 Full Deployment Walkthrough

### Step 1 — Build & Push Docker Images

On your **Windows machine**:
```powershell
# From the project root
.\dockerbuild.ps1
```
> Bump `$VERSION` in `dockerbuild.ps1` before each rebuild.

---

### Step 2 — Prepare EC2 Node

SSH into your EC2 instance and prepare the MongoDB data directory:
```bash
sudo mkdir -p /data/mongodb
sudo chmod 777 /data/mongodb

# Note your node name exactly
kubectl get nodes
# Example: ip-172-31-27-22   Ready   control-plane ...
```

---

### Step 3 — Configure pv.yaml

Edit `k8s/pv.yaml` — replace the node name placeholder:
```yaml
values:
  - ip-172-31-27-22    # ← exact name from kubectl get nodes
```
> ⚠️ This is critical. Without `nodeAffinity`, MongoDB may reschedule to a different node and lose all data.

---

### Step 4 — Open EC2 Security Group

In AWS Console → EC2 → Security Groups → your cluster SG → **Inbound rules**:

| Type | Protocol | Port | Source |
|---|---|---|---|
| Custom TCP | TCP | **30080** | 0.0.0.0/0 |
| Custom TCP | TCP | **30443** | 0.0.0.0/0 |
| Custom TCP | TCP | 6443 | your-IP/32 (kubectl API) |

---

### Step 5 — Install Nginx Ingress Controller

```bash
# Install baremetal variant (NodePort, not LoadBalancer)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/baremetal/deploy.yaml

# Wait for controller pod
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Fix NodePorts to stable values (30080 / 30443)
kubectl apply -f k8s/ingress-nginx-patch.yaml

# Verify
kubectl get svc -n ingress-nginx
# TYPE=NodePort, PORT(S)=80:30080/TCP,443:30443/TCP
```

---

### Step 6 — Deploy the Application

```bash
# 1. Foundation — always apply these first
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# 2. Storage — PV before PVC (PVC is inside mongodb.yaml)
kubectl apply -f k8s/pv.yaml
kubectl apply -f k8s/mongodb.yaml

# 3. Wait for MongoDB to be healthy before starting backends
kubectl rollout status deployment/mongodb

# 4. Backend services
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/product-service.yaml
kubectl apply -f k8s/order-service.yaml

# 5. Frontend
kubectl apply -f k8s/frontend.yaml

# 6. Ingress routing
kubectl apply -f k8s/ingress.yaml
```

---

### Step 7 — Seed the Database

The `seeder.js` is bundled inside the product-service Docker image.
Run it directly inside a running pod — the `MONGO_URI` env var is already injected by the ConfigMap:

```bash
kubectl exec -it deployment/product-service -- node seeder.js
```

Expected output:
```
[dotenv@17.3.1] injecting env (0) from .env
Nexus Seeder: Connected to MongoDB
Nexus Seeder: Games seeded successfully!
```

Verify:
```bash
# Count documents via mongosh
kubectl exec -it deployment/mongodb -- mongosh microserviceProducts \
  --eval "db.products.countDocuments()"
# Expected: 30

# Or via the API
curl http://localhost:30080/api/products
```

---

### Step 8 — Access the App

```
http://<EC2-PUBLIC-IP>:30080
```

---

## 🔍 Troubleshooting

### PVC stuck in Pending
```bash
kubectl describe pvc mongodb-pvc
# Cause: node name mismatch in pv.yaml
kubectl delete -f k8s/pv.yaml
# Fix the name, then:
kubectl apply -f k8s/pv.yaml
```

### Services connect to localhost:27017 instead of mongodb:27017
```
Cause: The .env files baked into the image contain MONGO_URI=mongodb://localhost:27017/...
       dotenv only injects env vars NOT already set in the environment.
       The ConfigMap explicitly sets MONGO_URI so dotenv is skipped (shows "injecting env (0)").

Fix:   kubectl apply -f k8s/configmap.yaml
       kubectl rollout restart deployment/auth-service
       kubectl rollout restart deployment/product-service
       kubectl rollout restart deployment/order-service

Confirm fix: logs should show "[dotenv@17.3.1] injecting env (0) from .env"
```

### Pods CrashLoopBackOff — MongoDB not ready
```bash
# Backends started before MongoDB was ready
kubectl rollout restart deployment/auth-service
kubectl rollout restart deployment/product-service
kubectl rollout restart deployment/order-service
```

### Frontend shows blank page / JS error in browser
```
Cause: framer-motion v12 + React 19 + Vite production build drops the
       internal Ghost component. Also check for missing icon imports.
Fix:   Ensure framer-motion is pinned to ^11.x in package.json (not v12).
       Rebuild and push the frontend image.
```

### Can't reach app on port 30080
```bash
# Check EC2 SG allows port 30080
kubectl get pods -n ingress-nginx               # controller must be Running
kubectl get svc -n ingress-nginx                # NodePort must show :30080
kubectl get ingress microservice-ingress        # routes must be listed
```

### View live logs
```bash
kubectl logs -f deployment/auth-service
kubectl logs -f deployment/product-service
kubectl logs -f deployment/order-service
kubectl logs -f deployment/frontend
```

### Exec into a pod for debugging
```bash
# Test internal DNS resolution
kubectl exec -it deployment/auth-service -- sh
# Inside the pod:
curl http://mongodb:27017
curl http://product-service:5002/health
```

---

## 🛡️ Production Hardening Applied

| Feature | Implementation |
|---|---|
| **Non-root containers** | All Node.js services run as `node` user (`USER node`) |
| **Secrets management** | `JWT_SECRET` in K8s Secret, injected as env var — never in code |
| **MONGO_URI override** | Explicitly set via ConfigMap to prevent dotenv from injecting localhost URI |
| **Liveness probes** | `/health` endpoint — auto-restarts hung containers |
| **Readiness probes** | `/health` endpoint — holds traffic until MongoDB is connected |
| **Graceful shutdown** | `SIGTERM` handler in all Node.js services — prevents 502 on rolling updates |
| **High availability** | 2 replicas for all services |
| **Resource limits** | CPU/memory requests & limits on every container |
| **Persistent storage** | hostPath PV with `nodeAffinity` — data survives pod restarts |
| **Data retention** | `reclaimPolicy: Retain` — data survives PVC deletion |
| **MongoDB strategy** | `Recreate` — ensures clean single-writer access to PVC |
| **nginx Gzip** | Frontend compresses `js/css/json/svg` in transit |
| **Static asset caching** | `Cache-Control: public` with 1-year expiry on assets |
| **API routing** | nginx Ingress routes `/api/*` to microservices, `/*` to SPA |

---

## ♻️ Update Workflow

```bash
# 1. Make code changes locally
# 2. Bump $VERSION in dockerbuild.ps1 (e.g. v11 → v12)
# 3. Build & push (Windows):
.\dockerbuild.ps1

# 4. Update the image tag in the relevant k8s yaml files
# 5. Apply (EC2 node):
kubectl apply -f k8s/<changed-service>.yaml

# 6. Monitor rolling update
kubectl rollout status deployment/<service-name>
```

---

## 📈 Scaling

```bash
# Scale any deployment horizontally
kubectl scale deployment product-service --replicas=4

# Monitor
kubectl rollout status deployment/product-service
kubectl get pods -l app=product-service
```
