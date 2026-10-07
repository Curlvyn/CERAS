CERAS - Community Emergency Response and Alert System

This repository contains a Vite frontend for GitHub Pages and a small Node backend API for Render.

Project structure

- `frontend/` - Static multi-page CERAS website.
- `frontend/src/main.js` - Shared frontend behavior and API calls.
- `frontend/css/main.css` - Site styles.
- `frontend/public/images/` - Site images.
- `frontend/vite.config.js` - Vite build configuration for GitHub Pages.
- `backend/server.js` - Node API for auth, profile updates, and report submission.
- `.github/workflows/deploy.yml` - GitHub Pages deployment workflow.

Local development

```powershell
npm install
npm run dev
```

Run the backend locally in a second terminal:

```powershell
npm run dev:api
```

By default, the frontend uses `http://localhost:3000` for login/register when `VITE_API_URL` is not set.

Deployment

1. Deploy the backend on Render as a Node Web Service.
2. Use `npm install` as the Render build command.
3. Use `npm start` as the Render start command.
4. Add `FRONTEND_ORIGIN=https://curlvyn.github.io` in Render. This is the site origin; do not include `/CERAS/`.
5. Add strong seeded account passwords in Render. Each value must be at least 14 characters and include uppercase, lowercase, a number, and a symbol:
   - `ADMIN_PASSWORD`
   - `POLICE_PASSWORD`
   - `FIRE_PASSWORD`
   - `AMBULANCE_PASSWORD`
   - `NADMO_PASSWORD`
6. Set up Google sign-in:
   - Open [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials), select or create a project, and configure the Google Auth Platform consent screen.
   - Create an OAuth client ID with application type **Web application**.
   - Add `https://curlvyn.github.io` under **Authorized JavaScript origins**. For local development, also add `http://localhost:5173`. Do not add `/CERAS/` or a redirect URI; this app uses the Google Identity Services popup flow.
   - Copy the client ID (it ends in `.apps.googleusercontent.com`). The client ID is not a client secret.
7. Set the client ID in both places, exactly the same:
   - Render service environment: `GOOGLE_CLIENT_ID`
   - GitHub repository **Settings → Secrets and variables → Actions → New repository secret**: name it `VITE_GOOGLE_CLIENT_ID`
8. Add the Render URL as the GitHub Actions repository secret `VITE_API_URL`.
9. Enable GitHub Pages with source set to GitHub Actions.
10. Save the Render environment variables and redeploy the backend. In GitHub, open **Actions → Deploy GitHub Pages → Run workflow** (or push to `main`) to rebuild and publish the frontend with the client ID.

If Google's consent screen is still in testing mode, add the Google account you will use as a test user in the Google Auth Platform audience settings.

Demo accounts

- `admin@ceras.com` / value of `ADMIN_PASSWORD`
- `police@ceras.com` / value of `POLICE_PASSWORD`
- `fire@ceras.com` / value of `FIRE_PASSWORD`
- `ambulance@ceras.com` / value of `AMBULANCE_PASSWORD`
- `nadmo@ceras.com` / value of `NADMO_PASSWORD`

Note: the backend currently stores demo data in `backend/data/store.json`. For production, use a real database such as Postgres.

To create a password locally, use a password manager or run:

```powershell
node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url') + 'Aa1!')"
```
