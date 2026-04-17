# Deployment Guide for AuraMarket

Follow these steps to deploy your E-commerce application using **Neon DB** (PostgreSQL), **Render** (Backend), and **Vercel** (Frontend).

## Phase 1: Neon DB Setup (Database)

1.  **Sign up/Login**: Go to [Neon.tech](https://neon.tech/) and create an account.
2.  **Create a New Project**:
    *   Name: `AuraMarketDB`
    *   Database Name: `ecommerce`
    *   Region: Choose one closest to you (e.g., US East, Frankfurt).
3.  **Get Connection String**:
    *   Once the project is created, copy the **Connection Details** from the dashboard.
    *   It will look like: `postgresql://[user]:[password]@[hostname]/ecommerce?sslmode=require`
4.  **Extract Credentials**:
    *   `SPRING_DATASOURCE_URL`: The entire string but change `postgresql://` to `jdbc:postgresql://`.
    *   `SPRING_DATASOURCE_USERNAME`: The `[user]` part.
    *   `SPRING_DATASOURCE_PASSWORD`: The `[password]` part.

---

## Phase 2: Render Deployment (Spring Boot Backend)

1.  **Connect GitHub**: Go to [Render.com](https://render.com/), sign up, and connect your GitHub repository.
2.  **Create a New Web Service**:
    *   Select your repository.
    *   **Root Directory**: `Ecommerce-Backend`
    *   **Environment**: `Docker`
    *   **Region**: Same as Neon DB.
3.  **Configure Environment Variables**:
    *   Click on the **Environment** tab and add the following:
      | Key | Value |
      | :--- | :--- |
      | `SPRING_DATASOURCE_URL` | Your Neon JDBC URL |
      | `SPRING_DATASOURCE_USERNAME` | Your Neon Username |
      | `SPRING_DATASOURCE_PASSWORD` | Your Neon Password |
      | `JWT_SECRET` | A random 32+ character string |
      | `ALLOWED_ORIGINS` | `http://localhost:5173,https://your-vercel-app.vercel.app` (Add your Vercel URL later) |
4.  **Deploy**: Click **Create Web Service**. Wait for the build and deployment to finish.
5.  **Copy URL**: Once deployed, copy your Render URL (e.g., `https://ecom-backend.onrender.com`).

---

## Phase 3: Vercel Deployment (React Frontend)

1.  **Connect GitHub**: Go to [Vercel.com](https://vercel.com/), sign up, and connect your repository.
2.  **Add New Project**:
    *   Select your repository.
    *   **Root Directory**: `Ecommerce-Frontend`
    *   **Framework Preset**: `Vite`
3.  **Configure Environment Variables**:
    *   Add the following variable:
      | Key | Value |
      | :--- | :--- |
      | `VITE_API_BASE_URL` | `https://your-render-url.onrender.com/api` (Use the URL from Phase 2) |
4.  **Deploy**: Click **Deploy**.
5.  **Final Step**: Copy your Vercel app URL (e.g., `https://auramarket.vercel.app`) and add it to the `ALLOWED_ORIGINS` environment variable in **Render** (comma-separated).

---

## Troubleshooting

*   **Mixed Content Error**: Ensure your `VITE_API_BASE_URL` uses `https`.
*   **CORS Error**: Double-check that `ALLOWED_ORIGINS` in Render includes your Vercel URL exactly (no trailing slash).
*   **Database Connection**: If Flyway fails, ensure the Neon DB connection string is correct and has `?sslmode=require` (or is handled by the JDBC driver correctly).
