import { YourEnergyAPI } from './api-service';

const api = new YourEnergyAPI();
const backdrop = document.querySelector('.js-rating-backdrop');
const closeBtn = document.querySelector('.js-rating-close');
const form = document.querySelector('.js-rating-form');
const starsList = document.querySelector('.js-stars-list');
const ratingValue = document.querySelector('.js-rating-value');

let currentExerciseId = null;
let currentRating = 0;
let returnToExercise = false;

function handleRatingEsc(e) {
  if (e.key === 'Escape' && backdrop && !backdrop.classList.contains('is-hidden')) {
    closeRatingModal();
  }
}

// --- 1. ВІДКРИТТЯ ---
export function openRatingModal(id) {
  if (!backdrop) return;
  currentExerciseId = id;
  
  // Якщо відкрита модалка вправи, ховаємо її бекдроп (щоб не було два темних фони)
  const exerciseBackdrop = document.querySelector('.js-backdrop'); 
  returnToExercise = !!(exerciseBackdrop && !exerciseBackdrop.classList.contains('is-hidden'));
  if (returnToExercise) {
    exerciseBackdrop.classList.add('is-hidden');
  }

  backdrop.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleRatingEsc);
  resetForm(); // Скидаємо попередні дані
}

// --- 2. ЗАКРИТТЯ ---
function closeRatingModal() {
  backdrop.classList.add('is-hidden');
  document.removeEventListener('keydown', handleRatingEsc);
  
  // Якщо ми закриваємо рейтинг, повертаємо видимість модалки вправи
  const exerciseBackdrop = document.querySelector('.js-backdrop');
  if (returnToExercise && exerciseBackdrop) {
    // Повертаємо екран з деталями вправи (він залишався відкритим у фоні)
    exerciseBackdrop.classList.remove('is-hidden');
    // Скролл лишається заблокованим, бо модалка вправи знову видима
  } else {
    // Якщо модалки вправи не було - розблокуємо скролл
    document.body.style.overflow = '';
  }

  returnToExercise = false;
}

// --- 3. ЗІРОЧКИ (Клік) ---
if (starsList) {
  starsList.addEventListener('click', (e) => {
    // Шукаємо, чи клікнули по зірці (li або svg всередині)
    const star = e.target.closest('.star-item');
    if (!star) return;

    currentRating = Number(star.dataset.value);
    
    // Оновлюємо цифру (наприклад "4.0")
    ratingValue.textContent = currentRating.toFixed(1);

    // Фарбуємо всі зірки до обраної
    const stars = starsList.querySelectorAll('.star-item');
    stars.forEach((s, index) => {
      if (index < currentRating) {
        s.classList.add('active'); // Додаємо клас для жовтого кольору
      } else {
        s.classList.remove('active');
      }
    });
  });
}

// --- 4. ВІДПРАВКА ФОРМИ ---
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (currentRating === 0) {
      alert('Please select a rating star!');
      return;
    }

    const email = form.elements.email.value.trim();
    const review = form.elements.comment.value.trim();

    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      // Відправляємо на сервер
      await api.patchRating(currentExerciseId, { rate: currentRating, email, review });
      
      alert('Thank you! Your rating has been accepted.');
      closeRatingModal();
      
    } catch (error) {
      console.error(error);
      // Сервер повертає 409 Conflict, якщо такий email вже голосував
      if (error.response && error.response.status === 409) {
          alert('You have already rated this exercise.');
      } else {
          alert('Something went wrong. Please try again.');
      }
      closeRatingModal();
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

function resetForm() {
  form.reset();
  currentRating = 0;
  ratingValue.textContent = '0.0';
  starsList.querySelectorAll('.star-item').forEach(s => s.classList.remove('active'));
}

// Слухачі закриття
if (closeBtn) closeBtn.addEventListener('click', closeRatingModal);
if (backdrop) backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeRatingModal(); });