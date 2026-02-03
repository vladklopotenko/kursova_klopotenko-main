import { YourEnergyAPI } from './api-service';

const api = new YourEnergyAPI();
const quoteText = document.querySelector('.js-quote-text');
const quoteAuthor = document.querySelector('.js-quote-author');
const LS_KEY = 'quoteOfTheDay';

// Функція отримання поточної дати у форматі "DD/MM/YYYY"
function getTodayDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function renderQuote() {
  if (!quoteText) return; // Якщо на сторінці немає блоку цитати

  const today = getTodayDate();
  
  // 1. Пробуємо дістати збережену цитату
  const savedData = JSON.parse(localStorage.getItem(LS_KEY));

  // 2. Якщо цитата є і дата збігається з сьогоднішньою -> малюємо з пам'яті
  if (savedData && savedData.date === today) {
    quoteText.textContent = savedData.quote;
    quoteAuthor.textContent = savedData.author;
    return;
  }

  // 3. Якщо немає або дата стара -> робимо запит на сервер
  try {
    const data = await api.getQuote();
    
    // Малюємо
    quoteText.textContent = data.quote;
    quoteAuthor.textContent = data.author;

    // Зберігаємо в LocalStorage з новою датою
    localStorage.setItem(LS_KEY, JSON.stringify({
      quote: data.quote,
      author: data.author,
      date: today
    }));
    
  } catch (error) {
    console.error('Error fetching quote:', error);
    quoteText.textContent = "Your energy is your greatest strength.";
    quoteAuthor.textContent = "Unknown";
  }
}