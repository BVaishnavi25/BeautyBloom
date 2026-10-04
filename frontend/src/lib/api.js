const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, data) { super(message); this.status = status; this.data = data; }
}

async function request(method, path, body) {
  const headers = { 'X-BB-Client': 'web' }; // CSRF defence, checked by the server on every write
  let payload;
  if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: payload, credentials: 'include' });
  } catch {
    throw new ApiError("We couldn't reach the server. Please check your connection and try again.", 0, null);
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new ApiError((data && (data.error || data.message)) || `Request failed (${res.status})`, res.status, data);
  return data;
}

export const api = {
  content: () => request('GET', '/content'),
  me: () => request('GET', '/auth/me'),
  signup: (b) => request('POST', '/auth/signup', b),
  login: (b) => request('POST', '/auth/login', b),
  logout: () => request('POST', '/auth/logout'),
  state: () => request('GET', '/state'),
  saveProfile: (profile) => request('PUT', '/profile', profile),
  applyQuiz: () => request('POST', '/profile/apply-quiz'),
  submitQuiz: (answers) => request('POST', '/quiz', { answers }),
  saveJournal: (journal) => request('PUT', '/journal', { journal }),
  favorites: () => request('GET', '/favorites'),
  addFavorite: (itemType, itemId) => request('POST', '/favorites', { itemType, itemId }),
  removeFavorite: (itemType, itemId) => request('DELETE', `/favorites/${encodeURIComponent(itemType)}/${encodeURIComponent(itemId)}`),
  saveRoutine: (routineEntries) => request('PUT', '/routine', { routineEntries }),
  exportData: () => request('GET', '/account/export'),
  deleteAccount: () => request('DELETE', '/account'),
};
