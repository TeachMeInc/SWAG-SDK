// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ react() ],
  assetsInclude: [ '**/*.handlebars' ],
  base: 'https://content.shockwave.com/qa/swag-demo/',
});
