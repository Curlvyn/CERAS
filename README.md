CERAS — Community Emergency Response and Alert System

This repository contains the CERAS multi-page frontend and a small Vite development authentication/API service for the Ghana emergency response portal demo.

Contents

- `index.html` — Home page
- `about.html` — About Us
- `incident-reporting.html` — Incident reporting demo (static)
- `community-alerts.html` — Alerts (static feed)
- `volunteer-network.html` — Volunteer network
- `safety-resources.html` — Safety and preparedness resources
- `contact.html` — Contact information
- `css/main.css` — Design system and styles
- `src/main.js` — UI animations, navigation, session-aware controls, and alert rendering
- `images/` — Visual assets used by the site

Authentication and authorization are enforced by the Vite middleware in `vite.config.js` while running locally. Sessions use HttpOnly cookies; roles are assigned by the server and protected pages/API routes reject unauthorized requests. The sample accounts are development fixtures only and must be replaced by a persistent identity provider, hashed passwords, and a real database before production deployment.

Local preview

Start the application through Vite so protected routes and API permissions are active:

```powershell
npm install
npm run dev
```

Opening HTML files directly or serving the built files with a static-only server bypasses the server authorization layer and is not supported for protected pages.

Project notes

- Static HTML pages are linked by the top navigation and footer.
- `about.html` now includes the full CERAS mission and organizational background.
- Login authenticates by email and password; the server determines the user role and destination.
- Community users can submit reports, agency users can access only their agency dashboard, and administrators can access `admin.html`.
- Visitors and mismatched roles receive an Access Denied response for protected URLs.
