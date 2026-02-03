import { YourEnergyAPI } from './api-service';

const api = new YourEnergyAPI();
const form = document.querySelector('.js-footer-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Отримуємо email
    const email = form.elements.email.value.trim();
    if (!email) return;

    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      // Відправляємо на сервер
      const response = await api.subscribe(email);
      
      // Успіх
      alert(`Success! ${response.message || 'You have subscribed.'}`);
      form.reset();
      
    } catch (error) {
      // Помилка (наприклад, вже підписаний)
      alert('Subscription failed. Maybe this email is already subscribed?');
      console.error(error);
    } finally {
      // Повертаємо кнопку назад
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}