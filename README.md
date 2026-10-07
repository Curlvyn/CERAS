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
6. Configure persistent storage for the backend. The JSON store contains accounts, reports, and audit records; without a persistent Render disk or database, this data can be lost on restart or redeploy. For a Render disk mounted at `/var/data`, set `DATA_FILE=/var/data/store.json`.
7. Add the Render URL as the GitHub Actions repository secret `VITE_API_URL`.
8. Enable GitHub Pages with source set to GitHub Actions.
9. Save the Render environment variables and redeploy the backend. In GitHub, open **Actions → Deploy GitHub Pages → Run workflow** (or push to `main`) to rebuild and publish the frontend.

Maps use Leaflet from unpkg and OpenStreetMap tiles, so map views require an internet connection. The admin dashboard centers on Ghana even before GPS-tagged reports are submitted; individual incident markers require reports with GPS coordinates.

Demo accounts

- `admin@ceras.com` / value of `ADMIN_PASSWORD`
- `police@ceras.com` / value of `POLICE_PASSWORD`
- `fire@ceras.com` / value of `FIRE_PASSWORD`
- `ambulance@ceras.com` / value of `AMBULANCE_PASSWORD`
- `nadmo@ceras.com` / value of `NADMO_PASSWORD`

Note: the backend currently stores demo data and account creation records in the JSON file selected by `DATA_FILE` (default: `backend/data/store.json`), under `users` and `auditLogs`. For production, use a managed database such as Postgres and establish an appropriate retention policy for personal account details.

To create a password locally, use a password manager or run:

```powershell
node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url') + 'Aa1!')"
```
