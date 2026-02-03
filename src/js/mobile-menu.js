const openBtn = document.querySelector('.js-open-menu');
const closeBtn = document.querySelector('.js-close-menu');
const menuContainer = document.querySelector('.js-menu-container');

function toggleMenu() {
  const isMenuOpen = openBtn.getAttribute('aria-expanded') === 'true' || false;
  openBtn.setAttribute('aria-expanded', !isMenuOpen);
  
  menuContainer.classList.toggle('is-open');

  // Блокуємо скрол на фоні
  if (menuContainer.classList.contains('is-open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Слухачі
if (openBtn && closeBtn) {
  openBtn.addEventListener('click', toggleMenu);
  closeBtn.addEventListener('click', toggleMenu);

  // Закрити меню при кліку на посилання (щоб перейти на іншу сторінку)
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
       menuContainer.classList.remove('is-open');
       document.body.style.overflow = '';
    });
  });
}