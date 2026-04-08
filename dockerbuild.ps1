$VERSION="v5"

cd auth-service
docker build -t lsingodiya/auth-service:$VERSION .
docker push lsingodiya/auth-service:$VERSION

cd ../product-service
docker build -t lsingodiya/product-service:$VERSION .
docker push lsingodiya/product-service:$VERSION

cd ../order-service
docker build -t lsingodiya/order-service:$VERSION .
docker push lsingodiya/order-service:$VERSION

cd ../frontend
docker build -t lsingodiya/frontend:$VERSION .
docker push lsingodiya/frontend:$VERSION