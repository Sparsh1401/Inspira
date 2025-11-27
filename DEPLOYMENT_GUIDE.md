# Deployment Guide

This guide will help you deploy your Pinterest Clone for free using **Supabase** (Database), **Render** (Backend), and **Vercel** (Frontend).

## Prerequisites
- GitHub account
- Accounts on [Supabase](https://supabase.com/), [Render](https://render.com/), and [Vercel](https://vercel.com/).

---

## 1. Database Setup (Supabase)
1.  Log in to **Supabase** and create a **New Project**.
2.  Give it a name (e.g., `pinterest-clone-db`) and a strong password.
3.  Choose a region close to you.
4.  Wait for the database to provision.
5.  Go to **Project Settings** -> **Database**.
6.  Under **Connection string**, select **URI** and copy the connection string.
    - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.project.supabase.co:5432/postgres`
    - **Important**: Replace `[YOUR-PASSWORD]` with the password you set in step 2.

---

## 2. Backend Deployment (Render)
1.  Push your latest code to **GitHub**.
2.  Log in to **Render** and click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Configuration**:
    - **Name**: `pinterest-clone-server`
    - **Region**: Same as your database if possible.
    - **Branch**: `main` (or your working branch)
    - **Root Directory**: `server`
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
    - **Instance Type**: Free
5.  **Environment Variables** (Click "Advanced" or "Environment"):
    - Add `DATABASE_URL`: Paste your Supabase connection string here.
    - Add `NODE_ENV`: `production`
    - Add `SESSION_SECRET`: (Optional) A random string for session security.
    - Add `CLIENT_URL`: `https://your-vercel-app-name.vercel.app` (You will update this *after* deploying the frontend, for now you can leave it or put a placeholder).
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. Copy the **Service URL** (e.g., `https://pinterest-clone-server.onrender.com`).

---

## 3. Frontend Deployment (Vercel)
1.  Log in to **Vercel** and click **Add New...** -> **Project**.
2.  Import your GitHub repository.
3.  **Configuration**:
    - **Framework Preset**: Create React App
    - **Root Directory**: Click "Edit" and select `client`.
4.  **Environment Variables**:
    - Add `REACT_APP_API_URL`: Paste your Render Backend URL (e.g., `https://pinterest-clone-server.onrender.com`).
    - Add `REACT_APP_GRAPHQL_URL`: Paste your Render Backend URL with `/graphql` appended (e.g., `https://pinterest-clone-server.onrender.com/graphql`).
5.  Click **Deploy**.

---

## 4. Final Configuration
1.  Once Vercel finishes, copy your **Frontend URL** (e.g., `https://pinterest-clone-client.vercel.app`).
2.  Go back to **Render** -> **Dashboard** -> **pinterest-clone-server** -> **Environment**.
3.  Update (or Add) `CLIENT_URL` with your Vercel Frontend URL.
4.  **Redeploy** the backend (Manual Deploy -> Deploy latest commit) to apply the change.

## Troubleshooting
- **Database Connection Errors**: Double-check your `DATABASE_URL` in Render. Ensure the password is correct and special characters are URL-encoded if necessary.
- **CORS Errors**: Ensure `CLIENT_URL` in Render matches your Vercel URL exactly (no trailing slash usually).
