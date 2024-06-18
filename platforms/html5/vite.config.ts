// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.handlebars"],
  server: {
    port: 8888
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SWAGAPI',
      fileName: 'swag-api',
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'swag-api.css';
          return assetInfo.name;
        },
      },
    },
  },
})
