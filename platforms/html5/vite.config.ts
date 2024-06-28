// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import handlebars from './plugins/handlebars';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    handlebars(),
    mkcert(),
  ],
  define: {
    'process.env': process.env
  },
  server: {
    port: 8888
  },
  preview: {
    port: 8888
  },
  build: {
    sourcemap: false,
    modulePreload: { polyfill: false },
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SWAGSDK',
      fileName: () => 'swag-api.js',
      formats: [ 'iife' ],
    },
    rollupOptions: {
      external: [
        'source-map'
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'swag-api.css';
          return assetInfo.name;
        },
      },
    },
  },
});
