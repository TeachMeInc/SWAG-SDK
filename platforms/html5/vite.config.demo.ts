// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import handlebars from './plugins/handlebars';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ 
    react(),
    handlebars({
      partialDir: resolve(__dirname, './src/templates/partials'),
    }),
  ],
  assetsInclude: [ '**/*.handlebars' ],
  base: 'https://content.shockwave.com/qa/swag-demo/',
});
