import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

<<<<<<< HEAD
export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src',
    base: command === 'serve' ? '/' : '/kursova_klopotenko-main/',
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
=======
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
>>>>>>> 2d8a1564e674122cfb0064562d38e9a24e11ae0e
      },
    },
<<<<<<< HEAD
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});
=======
  },

  plugins: [
    injectHTML(),
    FullReload(['./**/*.html']),
    SortCss({ sort: 'mobile-first' }),
  ],
}));
>>>>>>> 2d8a1564e674122cfb0064562d38e9a24e11ae0e
