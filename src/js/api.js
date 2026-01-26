const BASE = 'https://your-energy.b.goit.study';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }


  return res.json();
}

export const api = {
  getQuote: () => request('/api/quote'),

  getFilters: (filter, page, limit) => {
    const p = new URLSearchParams();
    if (filter) p.set('filter', filter);
    if (page) p.set('page', String(page));
    if (limit) p.set('limit', String(limit));
    return request(`/api/filters?${p.toString()}`);
  },

  getExercises: (params = {}) => {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
    });
    return request(`/api/exercises?${p.toString()}`);
  },

  getExerciseById: (id) => request(`/api/exercises/${id}`),

  rateExercise: (id, payload) =>
    request(`/api/exercises/${id}/rating`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  subscribe: (email) =>
    request('/api/subscription', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};
