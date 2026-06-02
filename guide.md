# Deployment Guide: Faceshield System

This guide provides step-by-step instructions to deploy the Faceshield system across cloud platforms. 
Based on your project structure, the recommended approach is:
- **Frontend** (Vite/React) -> **Netlify**
- **Backend** (NestJS) -> **Render** (Web Service)
- **Biometrics Service** (Python) -> **Render** (Web Service)
- **Database** (PostgreSQL) -> **Render** (PostgreSQL Database)

---

## 1. Prerequisites

1. Create a [GitHub](https://github.com/) repository and push your entire `Faceshield` project to it.
2. Create an account on [Render](https://render.com/).
3. Create an account on [Netlify](https://www.netlify.com/).

---

## 2. Database Deployment (Render)

1. Go to your **Render Dashboard** and click **New +** -> **PostgreSQL**.
2. Give your database a name (e.g., `faceshield-db`).
3. Select your preferred region and tier (Free tier is available).
4. Click **Create Database**.
5. Once created, scroll down to the **Connections** section and copy the **Internal Database URL** and **External Database URL**. You will need these for the backend.

---

## 3. Backend Deployment (Render)

The backend is a Node.js/NestJS application using Prisma.

1. Go to your **Render Dashboard** and click **New +** -> **Web Service**.
2. Connect your GitHub repository containing the `Faceshield` project.
3. Configure the service:
   - **Name**: `faceshield-edgeai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod` (or `node dist/main.js`)
4. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL`: Paste the **Internal Database URL** you copied earlier.
   - Add any other secrets from your local `backend/.env` file.
5. Click **Create Web Service**.
6. Once deployed, Render will provide a URL (e.g., `https://faceshield-backend.onrender.com`). **Save this URL**.

---

## 4. Biometrics Service Deployment (Render)

The biometrics service is a Python application.

1. Go to your **Render Dashboard** and click **New +** -> **Web Service**.
2. Connect the same GitHub repository.
3. Configure the service:
   - **Name**: `faceshield-biometrics`
   - **Root Directory**: `biometrics_service`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (or `uvicorn app:app --host 0.0.0.0 --port $PORT` depending on your framework).
4. Scroll down to **Environment Variables** and add any necessary keys from your `biometrics_service/.env`.
5. Click **Create Web Service**.
6. Once deployed, note down the URL. Ensure the NestJS backend's environment variables are updated with this new URL if it needs to communicate with the biometrics service.

---

## 5. Frontend Deployment (Netlify)

The frontend is a Vite application.

1. Go to your **Netlify Dashboard** and click **Add new site** -> **Import an existing project**.
2. Select **GitHub** and authorize Netlify.
3. Choose your `Faceshield` repository.
4. Configure the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click **Add environment variables**:
   - `VITE_API_URL`: Paste the URL of your **Backend Web Service** (e.g., `https://faceshield-backend.onrender.com`).
   - Add any other variables from your `frontend/.env`.
6. Click **Deploy site**.
7. Netlify will build and deploy your frontend. Once finished, you will receive a public Netlify URL where your users can access the Faceshield application!

---

## Post-Deployment Checklist

- [ ] **Run Migrations**: If your database is empty, you may need to run `npx prisma db push` or `npx prisma migrate deploy`. You can do this by using the Render Shell in your backend web service, or locally by replacing the `DATABASE_URL` in your `.env` with the **External Database URL** and running the migration locally.
- [ ] **CORS**: Ensure your NestJS backend allows Cross-Origin requests (CORS) from your new Netlify frontend URL.
- [ ] **Custom Domains**: You can add custom domains in both Netlify (for frontend) and Render (for backend/biometrics) through their respective settings panels.
