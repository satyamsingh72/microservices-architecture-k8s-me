$VERSION = "v11"
$ROOT = $PSScriptRoot

Write-Host "Building and pushing Docker images (version: $VERSION)..." -ForegroundColor Cyan

# Auth Service
Write-Host "`n[1/4] Building auth-service..." -ForegroundColor Yellow
Set-Location "$ROOT\auth-service"
docker build -t lsingodiya/auth-service:$VERSION .
docker push lsingodiya/auth-service:$VERSION

# Product Service
Write-Host "`n[2/4] Building product-service..." -ForegroundColor Yellow
Set-Location "$ROOT\product-service"
docker build -t lsingodiya/product-service:$VERSION .
docker push lsingodiya/product-service:$VERSION

# Order Service
Write-Host "`n[3/4] Building order-service..." -ForegroundColor Yellow
Set-Location "$ROOT\order-service"
docker build -t lsingodiya/order-service:$VERSION .
docker push lsingodiya/order-service:$VERSION

# Frontend
Write-Host "`n[4/4] Building frontend..." -ForegroundColor Yellow
Set-Location "$ROOT\frontend"
docker build -t lsingodiya/frontend:$VERSION .
docker push lsingodiya/frontend:$VERSION

# Return to root
Set-Location $ROOT

Write-Host "`nAll images built and pushed successfully!" -ForegroundColor Green
Write-Host "Deploy to Kubernetes with: kubectl apply -f k8s/" -ForegroundColor Cyan