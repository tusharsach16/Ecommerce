# 🛍️ AuraMarket - Professional Full Stack E-commerce

AuraMarket is a high-performance, containerized full-stack **E-commerce application** built with a modern architecture: **Spring Boot** (Java) for a robust backend and **ReactJS with Vite** for a lightning-fast frontend. It integrates **PostgreSQL** for data persistence and is ready for production deployment via **Docker** and **GitHub Actions CI/CD**.

---

## 📁 Project Structure

```text
AuraMarket/
├── Ecommerce-Backend/    # Spring Boot REST API
├── Ecommerce-Frontend/   # React + Vite frontend
├── docker-compose.yml    # Multi-container orchestration
└── .github/workflows/    # CI/CD pipeline
```

---

## 🚀 Quick Start (Docker - Recommended)

The easiest way to get the entire stack (Backend, Frontend, and PostgreSQL) running is using Docker Compose:

1. **Clone the repository.**
2. **Setup environment variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ecommerce
   ```
3. **Run the application**:
   ```bash
   docker-compose up -d --build
   ```
   *   **Frontend**: http://localhost:80
   *   **Backend API**: http://localhost:8080/api
   *   **Health Check**: http://localhost:8080/api/health

---

## 🧩 Backend - Spring Boot

### 🔧 Technologies
* **Java 17** & **Spring Boot 3.3.3**
* **Spring Data JPA** (Hibernate)
* **PostgreSQL** (Primary Database)
* **Flyway** (Database Migrations)
* **Maven** (Dependency Management)

### ⚙️ Local Development (Manual)
1. Ensure a PostgreSQL instance is running on port `5432`.
2. Update `Ecommerce-Backend/src/main/resources/application.properties` or set your local environment variables.
3. Run the application:
   ```bash
   cd Ecommerce-Backend
   ./mvnw spring-boot:run
   ```

---

## 💻 Frontend - React + Vite

### 🔧 Technologies
* **ReactJS** & **Vite**
* **Axios** (REST Client)
* **Bootstrap** (Styling)

### ⚙️ Local Development
1. Install dependencies:
   ```bash
   cd Ecommerce-Frontend
   npm install
   ```
2. Run in development mode:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## 🔄 CI/CD & Deployment

AuraMarket includes a production-ready **GitHub Actions pipeline** (`.github/workflows/docker-push.yml`):

* **Automated Builds**: Every push to the `main` branch triggers an automated build of both Docker images.
* **Auto-Push**: Built images are automatically pushed to your **Docker Hub** repository.

**Setup Requirements**:
Configure the following secrets in your GitHub repository:
- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub Personal Access Token.

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products |
| `GET` | `/api/product/{id}` | Get specific product details |
| `POST` | `/api/product` | Add a new product (with image) |
| `PUT` | `/api/product/{id}` | Update product details |
| `DELETE` | `/api/product/{id}` | Delete a product |
| `GET` | `/api/health` | Check Database & API status |

---

## 🤝 Contributing
Feel free to fork this project, open issues, or submit pull requests to improve AuraMarket!
