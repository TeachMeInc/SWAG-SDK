// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ 
    preact({
      reactAliasesEnabled: false,
    }),
  ],
  base: 'https://content.shockwave.com/qa/swag-demo/',
  // base: '/dist/',
});
