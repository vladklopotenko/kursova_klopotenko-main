import { YourEnergyAPI } from './api-service';
import { openModal } from './modal-exercise.js';

const api = new YourEnergyAPI();
const list = document.querySelector('.js-exercises-list');
const filterList = document.querySelector('.js-filter-list');
const paginationContainer = document.querySelector('.js-pagination');
const searchForm = document.querySelector('.js-search-form');
const sectionTitle = document.querySelector('.exercises-title');

// --- ЗМІННІ СТАНУ ---
let currentFilter = 'Muscles'; 
let currentCategory = ''; 
let currentPage = 1;
let currentKeyword = ''; 
let isExercisesView = false;

// --- 1. ФУНКЦІЇ РОЗМІТКИ ---

function createCategoryMarkup(arr) {
  return arr.map((item) => {
    // 🔥 ВИПРАВЛЕННЯ: перевіряємо обидва варіанти назви властивості
    const image = item.imgUrl || item.imgURL;

    return `
    <li class="exercises-item js-category-item" data-name="${item.name}" data-filter="${item.filter}">
      <div class="exercise-card" 
           style="background: linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${image}'); background-size: cover; background-position: center;">
        <h3 class="exercise-name">${item.name}</h3>
        <p class="exercise-filter">${item.filter}</p>
      </div>
    </li>
  `}).join('');
}

function createExerciseMarkup(arr) {
  return arr.map(({ _id, name, rating, burnedCalories, time, bodyPart, target }) => `
    <li class="exercises-item exercise-card-details" data-id="${_id}">
      <div class="exercise-card-top">
        <span class="exercise-badge">WORKOUT</span>
        <div class="exercise-rating-block">
          <span class="exercise-rating-text">${String(rating).padEnd(3, '.0')}</span>
          <svg class="exercise-star-icon" viewBox="0 0 32 32"><path d="M16 2 L20.32 10.75 L30 12.16 L23 18.98 L24.65 28.63 L16 24.08 L7.35 28.63 L9 18.98 L2 12.16 L11.68 10.75 Z"></path></svg>
        </div>
        <button class="exercise-start-btn js-start-btn" data-id="${_id}">
          Start
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/></svg>
        </button>
      </div>
      
      <div class="exercise-card-title">
        <div class="exercise-icon-run">
            <svg viewBox="0 0 32 32"><path d="M7 29.5l-5-4 3.5-3.5 3.5 2.5 4-5-3-3.5 1-4.5 4-2.5 3.5-3.5-1.5-3.5 4.5-2 3 3-1 4.5-5 3.5-2 4 1.5 1.5 3.5-0.5 3 2.5-0.5 3.5-4.5 1-4-2.5-3 2.5z"></path></svg>
        </div>
        <h3 class="exercise-title-text">${name}</h3>
      </div>

      <ul class="exercise-info-list">
        <li class="exercise-info-item">Burned calories:<span class="exercise-info-value">${burnedCalories} / ${time} min</span></li>
        <li class="exercise-info-item">Body part:<span class="exercise-info-value">${bodyPart}</span></li>
        <li class="exercise-info-item">Target:<span class="exercise-info-value">${target}</span></li>
      </ul>
    </li>
  `).join('');
}

function renderPaginationButtons(totalPages, page) {
  let markup = '';
  const endPage = Math.min(totalPages, 5); 

  for (let i = 1; i <= endPage; i++) {
    const activeClass = i === page ? 'active' : '';
    markup += `<li><button class="pagination-btn ${activeClass}" data-page="${i}">${i}</button></li>`;
  }
  paginationContainer.innerHTML = markup;
}

// --- 2. ЛОГІКА ЗАВАНТАЖЕННЯ ---

async function loadCategories(filter, page = 1) {
  isExercisesView = false;
  currentKeyword = ''; 
  if (searchForm) {
      searchForm.classList.add('is-hidden');
      searchForm.reset();
  }
  sectionTitle.textContent = 'Exercises';
  document.querySelector('.js-category-title').textContent = '';

  list.innerHTML = '<p style="text-align:center; width:100%">Loading categories...</p>';
  
  try {
    const data = await api.getFilters(filter, page, 12);
    list.innerHTML = createCategoryMarkup(data.results);
    
    if (data.totalPages > 1) renderPaginationButtons(data.totalPages, page);
    else paginationContainer.innerHTML = '';
    
  } catch (error) {
    console.error(error);
    list.innerHTML = '<p>Error loading categories</p>';
  }
}

async function loadExercisesList(categoryName, filter, page = 1) {
  isExercisesView = true;
  if (searchForm) searchForm.classList.remove('is-hidden');
  
  let paramName = '';
  if (filter === 'Muscles') paramName = 'muscles';
  if (filter === 'Body parts') paramName = 'bodypart';
  if (filter === 'Equipment') paramName = 'equipment';

  const categoryTitle = document.querySelector('.js-category-title');
  categoryTitle.textContent = `/ ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}`;

  list.innerHTML = '<p style="text-align:center; width:100%">Loading exercises...</p>';

  try {
    const data = await api.getExercises({ 
        [paramName]: categoryName, 
        page, 
        limit: 10,
        keyword: currentKeyword 
    });
    
    if (data.results.length === 0) {
      list.innerHTML = '<p style="text-align:center; width:100%">No exercises found.</p>';
      paginationContainer.innerHTML = '';
      return;
    }

    list.innerHTML = createExerciseMarkup(data.results);

    if (data.totalPages > 1) renderPaginationButtons(data.totalPages, page);
    else paginationContainer.innerHTML = '';

  } catch (error) {
    console.error(error);
    list.innerHTML = '<p>Error loading exercises</p>';
  }
}

// --- 3. ОБРОБНИКИ ПОДІЙ ---

// А) Пошук
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const form = e.currentTarget;
        const searchValue = form.elements.search.value.trim();
        
        currentKeyword = searchValue;
        currentPage = 1;
        
        loadExercisesList(currentCategory, currentFilter, currentPage);
    });
}

// Б) Клік по фільтрах
if (filterList) {
  filterList.addEventListener('click', (e) => {
    if (e.target.nodeName !== 'BUTTON') return;
    if (e.target.classList.contains('active') && !isExercisesView) return;

    filterList.querySelector('.active')?.classList.remove('active');
    e.target.classList.add('active');

    currentFilter = e.target.dataset.filter;
    currentPage = 1;
    currentCategory = '';
    
    loadCategories(currentFilter, currentPage);
  });
}

// В) Клік по списку (категорії або кнопка Start)
if (list) {
  list.addEventListener('click', (e) => {
    // 1. Клік по картці категорії
    const categoryCard = e.target.closest('.js-category-item');
    if (categoryCard && !isExercisesView) {
      const name = categoryCard.dataset.name;
      const filter = categoryCard.dataset.filter;
      
      currentCategory = name.toLowerCase();
      currentPage = 1;
      
      loadExercisesList(currentCategory, filter, currentPage);
      return;
    }

    // 2. Клік по кнопці Start -> Відкриття модалки
    const startBtn = e.target.closest('.js-start-btn');
    if (startBtn) {
      const id = startBtn.dataset.id;
      openModal(id);
    }
  });
}

// Г) Пагінація
if (paginationContainer) {
  paginationContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.pagination-btn');
    if (!btn) return;

    const newPage = Number(btn.dataset.page);
    if (newPage === currentPage) return;

    currentPage = newPage;

    if (isExercisesView) {
      loadExercisesList(currentCategory, currentFilter, currentPage);
    } else {
      loadCategories(currentFilter, currentPage);
    }
    
    document.querySelector('.exercises').scrollIntoView({ behavior: 'smooth' });
  });
}

// Старт
export function renderInitialExercises() {
  loadCategories('Muscles');
}