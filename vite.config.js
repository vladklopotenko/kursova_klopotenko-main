import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/kursova_klopotenko-main/',

  build: {
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: glob.sync('./*.html'),
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },

  plugins: [
    injectHTML(),
    FullReload(['./**/*.html']),
    SortCss({ sort: 'mobile-first' }),
  ],
}));
