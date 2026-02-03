// Базова URL адреса бекенду
const BASE_URL = 'https://your-energy.b.goit.study/api';

export class YourEnergyAPI {
  
  // 1. Отримати цитату
  async getQuote() {
    const res = await fetch(`${BASE_URL}/quote`);
    return res.json();
  }

  // 2. Отримати фільтри
  async getFilters(filter, page = 1, limit = 12) {
    const url = new URL(`${BASE_URL}/filters`);
    url.searchParams.set('filter', filter);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    
    const res = await fetch(url);
    return res.json();
  }

  // 3. Отримати вправи
  async getExercises({ bodypart, muscles, equipment, keyword, page = 1, limit = 10 }) {
    const url = new URL(`${BASE_URL}/exercises`);
    
    if (bodypart) url.searchParams.set('bodypart', bodypart);
    if (muscles) url.searchParams.set('muscles', muscles);
    if (equipment) url.searchParams.set('equipment', equipment);
    if (keyword) url.searchParams.set('keyword', keyword);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);

    const res = await fetch(url);
    return res.json();
  }

  // 4. Отримати одну вправу по ID
  async getExerciseById(id) {
    const res = await fetch(`${BASE_URL}/exercises/${id}`);
    return res.json();
  }

  // 5. Підписка на розсилку
  async subscribe(email) {
    const res = await fetch(`${BASE_URL}/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Subscription failed');
    return res.json();
  }

  // 6. Відправити рейтинг ⭐️
  async patchRating(id, { rate, email, review }) {
    const res = await fetch(`${BASE_URL}/exercises/${id}/rating`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        rate: Number(rate), 
        email, 
        review 
      })
    });
    
    // Обробка помилок (щоб працювала логіка з 409 Conflict)
    if (!res.ok) {
        const error = new Error('Rating failed');
        error.response = { status: res.status }; 
        throw error;
    }
    return res.json();
  }
}