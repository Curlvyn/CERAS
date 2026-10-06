import { defineConfig } from 'vite';
import crypto from 'node:crypto';

const users = new Map([
  ['user@ceras.com', { name: 'Community User', email: 'user@ceras.com', password: '123456789', role: 'user' }],
  ['admin@ceras.com', { name: 'Administrator', email: 'admin@ceras.com', password: 'admin123', role: 'admin' }],
  ['nadmo@ceras.gov.gh', { name: 'NADMO Team', email: 'nadmo@ceras.gov.gh', password: 'nadmo123', role: 'nadmo' }],
  ['police@ceras.gov.gh', { name: 'Police Desk', email: 'police@ceras.gov.gh', password: 'police123', role: 'police' }],
  ['ambulance@ceras.gov.gh', { name: 'Ambulance Desk', email: 'ambulance@ceras.gov.gh', password: 'ambulance123', role: 'ambulance' }],
  ['fire@ceras.gov.gh', { name: 'Fire Service Desk', email: 'fire@ceras.gov.gh', password: 'fire123', role: 'fire' }]
]);
const sessions = new Map();
const reports = [];
const publicUser = ({ password, ...user }) => user;

function authApi() {
  return {
    name: 'ceras-auth-api',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url, 'http://localhost');
        const session = sessions.get(request.headers.cookie?.match(/ceras_session=([^;]+)/)?.[1]);
        const body = () => new Promise((resolve) => {
          let data = '';
          request.on('data', (chunk) => { data += chunk; });
          request.on('end', () => resolve(data ? JSON.parse(data) : {}));
        });
        const send = (status, data, headers = {}) => {
          response.writeHead(status, { 'Content-Type': 'application/json', ...headers });
          response.end(JSON.stringify(data));
        };
        const requireRole = (roles) => session && roles.includes(session.role);

        if (url.pathname === '/api/session') return send(200, { user: session ? publicUser(session) : null });
        if (url.pathname === '/api/login' && request.method === 'POST') return body().then(({ email, password }) => {
          const user = users.get(String(email || '').toLowerCase());
          if (!user || user.password !== password) return send(401, { error: 'Invalid email or password.' });
          const token = crypto.randomBytes(32).toString('hex');
          sessions.set(token, user);
          return send(200, { user: publicUser(user) }, { 'Set-Cookie': `ceras_session=${token}; HttpOnly; SameSite=Lax; Path=/` });
        });
        if (url.pathname === '/api/register' && request.method === 'POST') return body().then(({ name, email, password }) => {
          const normalizedEmail = String(email || '').toLowerCase();
          if (!name || !normalizedEmail || !password || password.length < 6) return send(400, { error: 'Complete all fields and use a password of at least 6 characters.' });
          if (users.has(normalizedEmail)) return send(409, { error: 'An account already exists with that email.' });
          const user = { name: String(name).trim(), email: normalizedEmail, password, role: 'user' };
          users.set(normalizedEmail, user);
          const token = crypto.randomBytes(32).toString('hex');
          sessions.set(token, user);
          return send(201, { user: publicUser(user) }, { 'Set-Cookie': `ceras_session=${token}; HttpOnly; SameSite=Lax; Path=/` });
        });
        if (url.pathname === '/api/logout' && request.method === 'POST') {
          const token = request.headers.cookie?.match(/ceras_session=([^;]+)/)?.[1];
          sessions.delete(token);
          return send(200, {}, { 'Set-Cookie': 'ceras_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
        }
        if (url.pathname === '/api/profile' && request.method === 'PATCH') return body().then(({ name, email, phone, location }) => {
          if (!session) return send(401, { error: 'Sign in required.' });
          session.name = String(name || '').trim() || session.name;
          session.phone = String(phone || '').trim();
          session.location = String(location || '').trim();
          if (email && String(email).toLowerCase() !== session.email) return send(400, { error: 'Email changes require account verification.' });
          return send(200, { user: publicUser(session) });
        });
        if (url.pathname.startsWith('/api/admin/')) return requireRole(['admin']) ? send(200, { ok: true }) : send(session ? 403 : 401, { error: session ? 'Access denied.' : 'Sign in required.' });
        if (url.pathname.startsWith('/api/agency/')) return requireRole(['nadmo', 'police', 'fire', 'ambulance']) ? send(200, { ok: true }) : send(session ? 403 : 401, { error: session ? 'Access denied.' : 'Sign in required.' });
        if (url.pathname === '/api/reports' && request.method === 'POST') return requireRole(['user']) ? body().then((report) => { reports.unshift({ ...report, reporter: session.email }); send(201, { ok: true }); }) : send(session ? 403 : 401, { error: session ? 'Only community users may submit reports.' : 'Sign in required.' });

        const protectedPages = {
          '/profile.html': ['user', 'admin', 'nadmo', 'police', 'fire', 'ambulance'],
          '/admin.html': ['admin'],
          '/incident-reporting.html': ['user'],
          '/agency-detail.html': ['nadmo', 'police', 'fire', 'ambulance'],
          '/nadmo.html': ['nadmo'],
          '/ghana-police.html': ['police'],
          '/ambulance.html': ['ambulance'],
          '/fire-service.html': ['fire']
        };
        const allowed = protectedPages[url.pathname];
        if (allowed && !requireRole(allowed)) {
          response.statusCode = session ? 403 : 401;
          response.setHeader('Content-Type', 'text/html');
          return response.end('<!doctype html><title>Access Denied | CERAS</title><link rel="stylesheet" href="/css/main.css"><main class="page-content"><div class="container"><h1>Access Denied</h1><p>You do not have permission to view this page.</p><a class="btn btn-primary" href="/login.html">Sign in</a></div></main>');
        }
        return next();
      });
    }
  };
}

export default defineConfig({
  plugins: [authApi()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
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
        'agency-detail.html'
        ,'admin.html'
      ]
    }
  }
});
