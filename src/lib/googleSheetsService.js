const ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT;

async function http(method, path = '', body) {
  if (!ENDPOINT) throw new Error('No endpoint configured');
  const res = await fetch(join(ENDPOINT, path), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

function join(base, path) {
  if (!path) return base;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

const LS_KEY = 'sms_students_v1';

function lsRead() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function lsWrite(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function withId(data) {
  return {
    id: data.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: data.name?.trim() || '',
    email: data.email?.trim() || '',
    course: data.course?.trim() || '',
    status: data.status?.trim() || 'Active',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function listStudents() {
  if (!ENDPOINT) {
    await delay(200);
    return lsRead();
  }
  const { students } = await http('GET', '/students');
  return students || [];
}

export async function createStudent(payload) {
  if (!ENDPOINT) {
    await delay(200);
    const record = withId(payload);
    const data = [record, ...lsRead()];
    lsWrite(data);
    return record;
  }
  const { student } = await http('POST', '/students', payload);
  return student;
}

export async function updateStudent(id, payload) {
  if (!ENDPOINT) {
    await delay(200);
    const all = lsRead();
    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Not found');
    const updated = { ...all[idx], ...payload, updatedAt: new Date().toISOString() };
    all[idx] = updated;
    lsWrite(all);
    return updated;
  }
  const { student } = await http('PUT', `/students/${encodeURIComponent(id)}`, payload);
  return student;
}

export async function deleteStudent(id) {
  if (!ENDPOINT) {
    await delay(150);
    const all = lsRead();
    const rest = all.filter((s) => s.id !== id);
    lsWrite(rest);
    return { success: true };
  }
  return http('DELETE', `/students/${encodeURIComponent(id)}`);
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
