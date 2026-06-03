# Deployment Guide: Faceshield System

This guide provides step-by-step instructions to deploy the Faceshield system across cloud platforms. 
Based on your project structure, the recommended approach is:
- **Frontend** (Vite/React) -> **Vercel**
- **Backend** (NestJS) -> **Render** (Web Service)
- **Biometrics Service** (Python) -> **Render** (Web Service)
- **Database** (PostgreSQL) -> **Supabase** (With pgvector support)

---

## 1. Prerequisites

1. Create a [GitHub](https://github.com/) repository and push your entire `Faceshield` project to it.
2. Create an account on [Render](https://render.com/).
3. Create an account on [Vercel](https://vercel.com/).
4. Create a project on [Supabase](https://supabase.com/).

---

## 2. Database Configuration (Supabase)

The Faceshield system uses the **`pgvector`** extension in PostgreSQL to store and match facial biometrics. Supabase supports this natively.

1. Go to your **Supabase Dashboard** and open your project.
2. Navigate to **Project Settings** (gear icon) -> **Database**.
3. Scroll down to the **Connection pooling** section.
4. Set **Pool Mode** to **Session** (uses port `5432`). 
   > [!IMPORTANT]
   > Do **NOT** use the direct connection string (which resolves to IPv6) as Render free-tier environments are IPv4-only and will fail with `ENETUNREACH`. The Connection Pooler in Session Mode is IPv4-compatible and supports standard operations and schema migrations.
5. Copy the pooler **URI** connection string. It will look like:
   `postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
6. Keep this connection string ready; you will use it as the `DATABASE_URL` in your backend deployment.

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
   - **Start Command**: `node dist/src/main.js`
4. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL`: Paste the **Supabase Session Pooler URL** you copied in the previous step (make sure to replace `[password]` with your database password).
   - Add any other secrets from your local `backend/.env` file (e.g. `JWT_SECRET`, `BIOMETRICS_SERVICE_URL`).
5. Click **Create Web Service**.
6. Once deployed, Render will provide a URL (e.g., `https://faceshield-backend.onrender.com`). **Save this URL**.

---

## 4. Biometrics Service Deployment (Render)

The biometrics service is a Python FastAPI application.

1. Go to your **Render Dashboard** and click **New +** -> **Web Service**.
2. Connect the same GitHub repository.
3. Configure the service:
   - **Name**: `faceshield-biometrics`
   - **Root Directory**: `biometrics_service`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL`: Paste the same **Supabase Session Pooler URL**.
   - `JWT_SECRET`: Ensure this matches the `JWT_SECRET` used in your NestJS backend.
   - Add any other necessary keys from your local `biometrics_service/.env`.
5. Click **Create Web Service**.
6. Once deployed, note down the URL (e.g., `https://faceshield-biometrics.onrender.com`). Ensure the NestJS backend's environment variables are updated with this new URL (`BIOMETRICS_SERVICE_URL`) so they can communicate.

> [!NOTE]
> **Automated Health Checks**: Render automatically performs health checks on the root path `/` using a `HEAD` request. The Biometrics Service is pre-configured with explicit `HEAD /` and `GET /health` handlers to ensure the Render health check passes with a `200 OK` status and the service is successfully declared live.

---

## 5. Frontend Deployment (Vercel)

The frontend is a Vite application.

1. Go to your **Vercel Dashboard** and click **Add New** -> **Project**.
2. Select **GitHub** and authorize/import your `Faceshield` repository.
3. In the project configuration screen:
   - Set **Framework Preset** to **Vite**.
   - Set **Root Directory** to `frontend`.
   - Vercel will automatically configure the build command (`npm run build`) and output directory (`dist`).
4. Expand the **Environment Variables** section and add:
   - `VITE_API_URL`: Paste the URL of your Centralized NestJS Backend Web Service (e.g., `https://faceshield-backend.onrender.com`).
   - Add any other variables from your `frontend/.env`.
5. Click **Deploy**.
6. Vercel will build and deploy your frontend. Once finished, you will receive a public Vercel URL (e.g., `https://faceshield-edgeai.vercel.app`) where your users can access the Faceshield application!

---

## Post-Deployment Checklist

- [ ] **Run Migrations**: The backend runs in Session Mode over port `5432`, which allows direct DDL execution. You can push your database schema from your local terminal using:
  ```bash
  npx prisma db push
  ```
  *(Ensure your local `.env` has your database URL configured before running this).*
- [ ] **Verify Biometrics Health**: Check if the biometrics service is responding correctly by visiting your deployed root URL (e.g., `https://faceshield-biometrics.onrender.com/`). It should return:
  ```json
  {
    "status": "healthy",
    "service": "FaceShield Biometrics Engine",
    "version": "2.0.0"
  }
  ```
- [ ] **CORS Settings**: Ensure your NestJS backend allows Cross-Origin requests (CORS) from your new Vercel frontend URL.
- [ ] **Custom Domains**: You can add custom domains in both Vercel (for frontend) and Render (for backend/biometrics) through their respective settings panels.
 