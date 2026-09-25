const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, init) {
  const res = await fetch(`${BASE}/api${path}`, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

const json = (path, data) =>
  request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

export const api = {
  health: () => request('/health'),
  metrics: () => request('/metrics'),
  analyzeDocument: ({ file, text }) => {
    const form = new FormData();
    if (file) form.append('file', file);
    if (text) form.append('text', text);
    return request('/documents/analyze', { method: 'POST', body: form });
  },
  evaluateDecision: (data) => json('/decisions/evaluate', data),
  analyzeLanguage: (data) => json('/nlp/analyze', data),
  runForecast: (data) => json('/forecasts/run', data),
  contact: (data) => json('/contact', data),
};
