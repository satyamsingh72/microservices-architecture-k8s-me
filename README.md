# MicroStore: MERN Microservices Ecosystem

MicroStore is a robust, production-ready microservices application built with the **MERN stack** (MongoDB, Express, React, Node.js). It demonstrates a decoupled architecture with independent services for Authentication, Product Management, and Order Processing.

---

## 🏛️ Architecture Overview

The system is partitioned into four distinct services, each responsible for a specific domain:

| Service | Port | Database | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Auth Service** | `5001` | `microserviceAuth` | User lifecycle, JWT Authentication, Password Hashing |
| **Product Service** | `5002` | `microserviceProducts` | Product Catalog, Category Management |
| **Order Service** | `5003` | `microserviceOrders` | Transactional processing, Order History |
| **Frontend UI** | `5173` | N/A | Modern React Dashboard (built with Vite & Tailwind CSS) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ recommended
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017`
- **npm**: Package manager (included with Node.js)

### 1. Installation
Clone the repository and install dependencies for each service:
```powershell
# Install Backend Dependencies
cd auth-service; npm install
cd ../product-service; npm install
cd ../order-service; npm install

# Install Frontend Dependencies
cd ../frontend; npm install
```

### 2. Seed the Catalog
Before starting, populate the product database with initial items:
```powershell
cd product-service
node seeder.js
```

### 3. Running the Services
Open four separate terminal windows and run each service:

```powershell
# Terminal 1: Auth Service
cd auth-service; node server.js

# Terminal 2: Product Service
cd product-service; node server.js

# Terminal 3: Order Service
cd order-service; node server.js

# Terminal 4: Frontend (Vite)
cd frontend; npm run dev
```

---

## 🛠️ Tech Stack Details

### Backend (Node.js/Express)
- **Mongoose**: Modern object modeling for MongoDB.
- **JWT (jsonwebtoken)**: Secure token-based authentication.
- **Bcryptjs**: Industrial-strength password hashing.
- **Dotenv**: Environment variable management.

### Frontend (React/Vite)
- **Tailwind CSS v4**: Modern utility-first styling with PostCSS integration.
- **Lucide-React**: High-quality SVG icons for a premium look.
- **Axios**: Promised-based HTTP client for service communication.
- **Framer Motion**: Smooth UI transitions and micro-animations.

---

## 🔧 Troubleshooting Tips

### MongoDB Connection Issues
If you see `MongoParseError` or connection failures:
- Ensure MongoDB is running as a service on your machine.
- We use `127.0.0.1` instead of `localhost` for consistent routing on Windows systems.

### Tailwind CSS Build Errors
In Tailwind CSS v4, we use `@import "tailwindcss";` in the `index.css` and the `@tailwindcss/postcss` plugin. Ensure these are correctly configured if you change the styling setup.

### Order Placement Failures
If orders fail with a `400 Bad Request`:
- The system requires a valid `userId` from a session.
- **Fix**: Log out and log back in to refresh your JWT and ensure your user ID is correctly stored in `localStorage`.

---

## 📜 License
Internal use and development reference.
