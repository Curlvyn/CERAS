import { createServer } from 'node:http';
import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE ? resolve(process.env.DATA_FILE) : resolve('backend/data/store.json');
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultUsers = [
  { name: 'Administrator', email: 'admin@ceras.com', password: 'admin123', role: 'admin' },
  { name: 'Police Response', email: 'police@ceras.com', password: 'police123', role: 'police' },
  { name: 'Fire Service', email: 'fire@ceras.com', password: 'fire123', role: 'fire' },
  { name: 'Ambulance Service', email: 'ambulance@ceras.com', password: 'ambulance123', role: 'ambulance' },
  { name: 'NADMO Response', email: 'nadmo@ceras.com', password: 'nadmo123', role: 'nadmo' }
];

const sessions = new Map();

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(':');
  if (!salt || !storedHash) return false;
  const candidate = pbkdf2Sync(password, salt, 120000, 32, 'sha256');
  const expected = Buffer.from(storedHash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function createUser({ name, email, password, role = 'user' }) {
  return {
    id: randomBytes(8).toString('hex'),
    name,
    email: email.toLowerCase(),
    role,
    phone: '',
    location: '',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };
}

function loadStore() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  } catch {
    const store = {
      users: defaultUsers.map(createUser),
      reports: []
    };
    saveStore(store);
    return store;
  }
}

function saveStore(store) {
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

const store = loadStore();

function getCorsHeaders(origin) {
  const localhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
  const allowed = FRONTEND_ORIGINS.includes(origin) || localhost;
  return {
    'Access-Control-Allow-Origin': allowed ? origin : (FRONTEND_ORIGINS[0] || '*'),
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Vary': 'Origin'
  };
}

function sendJson(response, status, data, origin) {
  response.writeHead(status, {
    ...getCorsHeaders(origin),
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function getSessionUser(request) {
  const header = request.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const userId = sessions.get(token);
  return store.users.find((user) => user.id === userId) || null;
}

function createSession(user) {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, user.id);
  return token;
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin || '';
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, getCorsHeaders(origin));
    response.end();
    return;
  }

  try {
    if (request.method === 'GET' && url.pathname === '/health') {
      sendJson(response, 200, { ok: true, service: 'CERAS API' }, origin);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/register') {
      const { name, email, password } = await readJson(request);
      if (!name || !email || !password) {
        sendJson(response, 400, { error: 'Name, email, and password are required.' }, origin);
        return;
      }
      if (store.users.some((user) => user.email === email.toLowerCase())) {
        sendJson(response, 409, { error: 'An account already exists for that email.' }, origin);
        return;
      }
      const user = createUser({ name, email, password });
      store.users.push(user);
      saveStore(store);
      sendJson(response, 201, { user: publicUser(user), token: createSession(user) }, origin);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/login') {
      const { email, password } = await readJson(request);
      const user = store.users.find((candidate) => candidate.email === String(email || '').toLowerCase());
      if (!user || !verifyPassword(password || '', user.passwordHash)) {
        sendJson(response, 401, { error: 'Invalid email or password.' }, origin);
        return;
      }
      sendJson(response, 200, { user: publicUser(user), token: createSession(user) }, origin);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/session') {
      const user = getSessionUser(request);
      sendJson(response, 200, { user: user ? publicUser(user) : null }, origin);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/logout') {
      const header = request.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      sessions.delete(token);
      sendJson(response, 200, { ok: true }, origin);
      return;
    }

    if (request.method === 'PATCH' && url.pathname === '/api/profile') {
      const user = getSessionUser(request);
      if (!user) {
        sendJson(response, 401, { error: 'Please sign in first.' }, origin);
        return;
      }
      const updates = await readJson(request);
      user.name = updates.name || user.name;
      user.phone = updates.phone || '';
      user.location = updates.location || '';
      saveStore(store);
      sendJson(response, 200, { user: publicUser(user) }, origin);
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/reports') {
      const user = getSessionUser(request);
      if (!user) {
        sendJson(response, 401, { error: 'Please sign in before submitting a report.' }, origin);
        return;
      }
      const report = await readJson(request);
      const savedReport = { id: randomBytes(8).toString('hex'), ...report, createdAt: new Date().toISOString() };
      store.reports.unshift(savedReport);
      saveStore(store);
      sendJson(response, 201, { report: savedReport }, origin);
      return;
    }

    sendJson(response, 404, { error: 'Route not found.' }, origin);
  } catch (error) {
    sendJson(response, 500, { error: 'Server error. Please try again.' }, origin);
  }
});

server.listen(PORT, () => {
  console.log(`CERAS API listening on port ${PORT}`);
});
