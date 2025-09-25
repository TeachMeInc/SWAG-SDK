// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import vitePluginSVGToFont from '@sumsolution/vite-plugin-svg-to-font';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [ 
    preact({
      reactAliasesEnabled: false,
    }),
    vitePluginSVGToFont({
      svgPath: resolve(__dirname, 'icons'),
      fontName: 'swag-icon',
    }),
  ],
  build: {
    outDir: './dist/qa/swag-demo/',
    emptyOutDir: true,
  },
  base: '/qa/swag-demo/',
});
