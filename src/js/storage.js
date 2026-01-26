const KEYS = {
  quote: 'ye_quote',
  favorites: 'ye_favorites',
};

export function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getQuoteCache() {
  return getJSON(KEYS.quote, null);
}
export function setQuoteCache(data) {
  setJSON(KEYS.quote, data);
}

export function getFavorites() {
  return getJSON(KEYS.favorites, []);
}
export function setFavorites(list) {
  setJSON(KEYS.favorites, list);
}
export function isFavorite(id) {
  return getFavorites().some((x) => String(x.id) === String(id));
}
export function toggleFavorite(exerciseBrief) {
  const favs = getFavorites();
  const id = String(exerciseBrief.id);
  const exists = favs.some((x) => String(x.id) === id);

  const next = exists ? favs.filter((x) => String(x.id) !== id) : [exerciseBrief, ...favs];
  setFavorites(next);
  return { next, exists: !exists };
}

export function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
