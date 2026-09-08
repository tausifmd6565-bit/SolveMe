# SolveMe — Production Hosting & Deployment Guide

This guide covers 3 hosting strategies for **SolveMe** (*"From Problems to Solutions"*), from a 30-second live public demo to full cloud deployment.

---

## Strategy 1: Instant 30-Second Live Public URL (No Sign-up Needed)
> **Best for:** Immediate demo presentation, sharing with evaluators or judges right now directly from your machine.

### Step 1: Ensure Backend & Frontend are running
Open two terminals in `prototype/`:
- **Terminal 1 (Backend):**
  ```powershell
  python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
  ```
- **Terminal 2 (Frontend):**
  ```powershell
  cd frontend
  npm run dev
  ```

### Step 2: Launch Public Tunnel
Double click `start_tunnel.bat` or run:
```powershell
npx localtunnel --port 5173
```
You will receive an instant public HTTPS link (e.g., `https://solveme-demo.loca.lt`) that anyone can open on mobile or desktop!

---

## Strategy 2: 100% Free Cloud Deployment (Vercel + Render)
> **Best for:** Permanent production hosting with automated CI/CD on every git push.

### Step 1: Push Code to GitHub
In your `prototype/` directory:
```powershell
git init
git add .
git commit -m "Deploy SolveMe full-stack prototype"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/solveme.git
git push -u origin main
```

---

### Step 2: Deploy Backend to Render (Free Python Web Service)
1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository (`solveme`).
3. Configure the service settings:
   - **Name:** `solveme-backend`
   - **Region:** Any (e.g., Singapore or Oregon)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
4. Click **Deploy Web Service**.
5. Once deployed, copy your backend URL (e.g., `https://solveme-backend.onrender.com`).
   - Verify health at: `https://solveme-backend.onrender.com/api/health`
   - View Swagger API docs at: `https://solveme-backend.onrender.com/docs`

---

### Step 3: Deploy Frontend to Vercel (Free React / Vite Hosting)
1. Go to [vercel.com](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your `solveme` GitHub repository.
3. Configure project settings:
   - **Root Directory:** Click Edit and select `frontend`.
   - **Framework Preset:** `Vite` (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_BASE`
   - **Value:** `https://solveme-backend.onrender.com` *(paste your Render backend URL from Step 2)*
5. Click **Deploy**.
6. In ~45 seconds, Vercel will give you a live production URL (e.g., `https://solveme.vercel.app`)!

---

## Strategy 3: Unified Single-Service Hosting (Render or Railway)
FastAPI is pre-configured to automatically serve the built React bundle (`frontend/dist`) under `/app` and `/portal`.

If you prefer deploying a single web service on Render without configuring Vercel:
1. In Render, set the **Build Command** to:
   ```bash
   pip install -r backend/requirements.txt && cd frontend && npm install && npm run build
   ```
2. Set the **Start Command** to:
   ```bash
   uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
   ```
3. Your full app will run on a single Render URL with zero CORS configuration!

---

## Pre-Deployment Verification Checklist
- [x] CORS middleware configured for all cloud and tunnel origins
- [x] Database seeds automatically on first run (`backend/app/seed_data.py`)
- [x] `.gitignore` created to keep repository clean of `node_modules` and cache
- [x] `vercel.json` SPA routing rules configured
- [x] `render.yaml` infrastructure-as-code blueprint ready
