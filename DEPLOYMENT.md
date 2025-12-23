# Deployment Guide

## 1. Push to GitHub

1.  Initialize Git (if not already done):
    ```bash
    git init
    ```

2.  Add all files:
    ```bash
    git add .
    ```

3.  Commit changes:
    ```bash
    git commit -m "Ready for deployment"
    ```

4.  Create a repository on GitHub (https://github.com/new).

5.  Link and Push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy Backend (Render)

1.  Go to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will detect `render.yaml`.
5.  **Environment Variables:** You will be prompted to enter values for `MONGODB_URI` and `JWT_SECRET`.
    - `MONGODB_URI`: Use your MongoDB Atlas connection string (e.g., `mongodb+srv://...`).
    - `JWT_SECRET`: Enter a secure random string.
6.  Click **Apply**. Render will deploy all 5 services + Redis.

## 3. Deploy Frontend (Vercel)

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project:**
    - **Root Directory:** Click `Edit` and select `frontend`.
    - **Framework Preset:** Create React App (should auto-detect).
    - **Environment Variables:**
        - `REACT_APP_API_BASE_URL`: Enter the URL of your deployed `food-api-gateway` from Render (e.g., `https://food-api-gateway-xxxx.onrender.com/api`).
5.  Click **Deploy**.

## Troubleshooting

- **MongoDB Access:** Ensure your MongoDB Atlas "Network Access" allows connections from Anywhere (`0.0.0.0/0`) or specific Render IPs.
- **Microservice Communication:** The `render.yaml` sets up internal communication automatically.
