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
4. Add `FRONTEND_ORIGIN=https://YOUR-GITHUB-USERNAME.github.io` in Render.
5. Add the Render URL as the GitHub Actions secret `VITE_API_URL`.
6. Enable GitHub Pages with source set to GitHub Actions.
7. Push to `main`; GitHub Actions builds `frontend/` and publishes `dist/`.

Demo accounts

- `admin@ceras.com` / `admin123`
- `police@ceras.com` / `police123`
- `fire@ceras.com` / `fire123`
- `ambulance@ceras.com` / `ambulance123`
- `nadmo@ceras.com` / `nadmo123`

Note: the backend currently stores demo data in `backend/data/store.json`. For production, use a real database such as Postgres.
