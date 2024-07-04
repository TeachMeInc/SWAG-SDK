// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import handlebars from './plugins/handlebars';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ 
    preact({
      reactAliasesEnabled: false,
    }),
    handlebars({
      partialDir: resolve(__dirname, './src/templates/partials'),
    }),
  ],
  base: 'https://content.shockwave.com/qa/swag-demo/',
});
