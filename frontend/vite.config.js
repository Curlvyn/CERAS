import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const frontendRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // 1. Keep your base URL for GitHub Pages
  base: '/CERAS/', 
  root: frontendRoot,
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: [
        'index.html',
        'about.html',
        'services.html',
        'contact.html',
        'incident-reporting.html',
        'community-alerts.html',
        'volunteer-network.html',
        'safety-resources.html',
        'login.html',
        'reset-password.html',
        'profile.html',
        'metrics.html',
        'nadmo.html',
        'ghana-police.html',
        'ambulance.html',
        'fire-service.html',
        'agency-detail.html',
        'admin.html'
      ].map((file) => resolve(frontendRoot, file))
    }
  }
});
