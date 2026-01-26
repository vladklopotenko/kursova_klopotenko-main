import { defineConfig } from 'vite';

// Для GitHub Pages без ручного налаштування repo-name
// (працює коректно, коли застосунок відкривається як статичний сайт)
export default defineConfig({
  base: './',
});
