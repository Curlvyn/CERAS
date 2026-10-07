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

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const PASSWORD_MIN_LENGTH = 14;
const PASSWORD_HASH_ITERATIONS = 310000;
const PASSWORD_HASH_ALGORITHM = 'sha256';
const devPasswords = {
  ADMIN_PASSWORD: 'Local-Admin-Only!2026',
  POLICE_PASSWORD: 'Local-Police-Only!2026',
  FIRE_PASSWORD: 'Local-Fire-Only!2026',
  AMBULANCE_PASSWORD: 'Local-Ambulance-Only!2026',
  NADMO_PASSWORD: 'Local-Nadmo-Only!2026'
};

function getRequiredPassword(envName) {
  const password = process.env[envName];
  if (!password && !isProduction) return devPasswords[envName];
  if (!password) {
    throw new Error(`${envName} must be set in production.`);
  }
  if (!isStrongPassword(password)) {
    throw new Error(`${envName} must be at least ${PASSWORD_MIN_LENGTH} characters and include uppercase, lowercase, a number, and a symbol.`);
  }
  return password;
}

const defaultUsers = [
  { name: 'Administrator', email: 'admin@ceras.com', password: getRequiredPassword('ADMIN_PASSWORD'), role: 'admin' },
  { name: 'Police Response', email: 'police@ceras.com', password: getRequiredPassword('POLICE_PASSWORD'), role: 'police' },
  { name: 'Fire Service', email: 'fire@ceras.com', password: getRequiredPassword('FIRE_PASSWORD'), role: 'fire' },
  { name: 'Ambulance Service', email: 'ambulance@ceras.com', password: getRequiredPassword('AMBULANCE_PASSWORD'), role: 'ambulance' },
  { name: 'NADMO Response', email: 'nadmo@ceras.com', password: getRequiredPassword('NADMO_PASSWORD'), role: 'nadmo' }
];

const sessions = new Map();

function hashPassword(password, salt = randomBytes(16).toString('hex'), iterations = PASSWORD_HASH_ITERATIONS) {
  const hash = pbkdf2Sync(password, salt, iterations, 32, PASSWORD_HASH_ALGORITHM).toString('hex');
  return `pbkdf2:${PASSWORD_HASH_ALGORITHM}:${iterations}:${salt}:${hash}`;
}

function parsePasswordHash(storedPassword) {
  const parts = String(storedPassword || '').split(':');
  if (parts.length === 5 && parts[0] === 'pbkdf2') {
    const [, algorithm, iterations, salt, hash] = parts;
    return { algorithm, iterations: Number(iterations), salt, hash };
  }
  if (parts.length === 2) {
    const [salt, hash] = parts;
    return { algorithm: 'sha256', iterations: 120000, salt, hash };
  }
  return null;
}

function verifyPassword(password, storedPassword) {
  const parsed = parsePasswordHash(storedPassword);
  if (!parsed?.salt || !parsed.hash || !parsed.iterations) return false;
  const candidate = pbkdf2Sync(password, parsed.salt, parsed.iterations, 32, parsed.algorithm);
  const expected = Buffer.from(parsed.hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function needsPasswordRehash(storedPassword) {
  const parsed = parsePasswordHash(storedPassword);
  return (
    !parsed ||
    parsed.algorithm !== PASSWORD_HASH_ALGORITHM ||
    parsed.iterations < PASSWORD_HASH_ITERATIONS
  );
}

function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function requireAdmin(request, response, origin) {
  const user = getSessionUser(request);
  if (!user) {
    sendJson(response, 401, { error: 'Please sign in first.' }, origin);
    return null;
  }
  if (user.role !== 'admin') {
    sendJson(response, 403, { error: 'Admin access is required.' }, origin);
    return null;
  }
  return user;
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

function recordAuditEvent(eventType, details = {}) {
  if (!Array.isArray(store.auditLogs)) {
    store.auditLogs = [];
  }

  const event = {
    id: randomBytes(8).toString('hex'),
    eventType,
    createdAt: new Date().toISOString(),
    ...details
  };

  store.auditLogs.unshift(event);
  return event;
}

function isStrongPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= PASSWORD_MIN_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    !/(password|admin|ceras|123456|qwerty)/i.test(password)
  );
}

function ensureSeedUsers(store) {
  let changed = false;
  for (const seedUser of defaultUsers) {
    const existingUser = store.users.find((user) => user.email === seedUser.email.toLowerCase());
    if (!seedUser.password) {
      if (existingUser) {
        store.users = store.users.filter((user) => user.email !== seedUser.email.toLowerCase());
        changed = true;
      }
      continue;
    }
    if (!existingUser) {
      store.users.push(createUser(seedUser));
      changed = true;
      continue;
    }
    existingUser.name = seedUser.name;
    existingUser.role = seedUser.role;
    if (!verifyPassword(seedUser.password, existingUser.passwordHash) || needsPasswordRehash(existingUser.passwordHash)) {
      existingUser.passwordHash = hashPassword(seedUser.password);
      changed = true;
    }
  }
  return changed;
}

function loadStore() {
  let store;
  try {
    store = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  } catch {
    store = {
      users: defaultUsers.map(createUser),
      reports: [],
      auditLogs: []
    };
    saveStore(store);
  }

  if (!Array.isArray(store.auditLogs)) store.auditLogs = [];
  if (!Array.isArray(store.reports)) store.reports = [];

  if (ensureSeedUsers(store)) saveStore(store);
  return store;
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
    if (request.method === 'GET' && url.pathname === '/') {
      sendJson(response, 200, {
        ok: true,
        service: 'CERAS API',
        health: '/health',
        endpoints: ['/api/register', '/api/login', '/api/session', '/api/logout', '/api/profile', '/api/reports', '/api/admin/summary', '/api/admin/audit-log']
      }, origin);
      return;
    }

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
      if (!isStrongPassword(password)) {
        sendJson(response, 400, { error: `Use at least ${PASSWORD_MIN_LENGTH} characters with uppercase, lowercase, a number, and a symbol. Avoid common words like password, admin, or CERAS.` }, origin);
        return;
      }
      if (store.users.some((user) => user.email === email.toLowerCase())) {
        sendJson(response, 409, { error: 'An account already exists for that email.' }, origin);
        return;
      }
      const user = createUser({ name, email, password });
      store.users.push(user);
      recordAuditEvent('account_created', {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        source: 'email_registration'
      });
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
      if (needsPasswordRehash(user.passwordHash)) {
        user.passwordHash = hashPassword(password);
        saveStore(store);
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

    if (request.method === 'GET' && url.pathname === '/api/reports') {
      const user = requireAdmin(request, response, origin);
      if (!user) return;
      sendJson(response, 200, { reports: store.reports }, origin);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/summary') {
      const user = requireAdmin(request, response, origin);
      if (!user) return;
      sendJson(response, 200, {
        generatedAt: new Date().toISOString(),
        users: store.users.map(publicUser),
        reports: store.reports,
        auditLogs: store.auditLogs || [],
        sessions: sessions.size,
        security: {
          passwordMinLength: PASSWORD_MIN_LENGTH,
          passwordHash: `pbkdf2-${PASSWORD_HASH_ALGORITHM}`,
          passwordHashIterations: PASSWORD_HASH_ITERATIONS
        }
      }, origin);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/audit-log') {
      const admin = requireAdmin(request, response, origin);
      if (!admin) return;
      sendJson(response, 200, { auditLogs: store.auditLogs || [] }, origin);
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
