const btn = document.getElementById('scrollToTopBtn');

if (btn) {
  // 1. Відстежуємо скрол
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.remove('is-hidden');
    } else {
      btn.classList.add('is-hidden');
    }
  });

  // 2. Клік - плавний скрол нагору
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}