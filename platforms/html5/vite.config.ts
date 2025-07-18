// @ts-nocheck

import { ResolvedConfig, defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import handlebars from './plugins/handlebars';
import mkcert from 'vite-plugin-mkcert';
import vitePluginSVGToFont from '@sumsolution/vite-plugin-svg-to-font';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      reactAliasesEnabled: false,
    }),
    handlebars(),
    mkcert(),
    vitePluginSVGToFont({
      svgPath: resolve(__dirname, 'icons'),
      fontName: 'swag-icon',
    }),
  ],
  base: '/dist/',
  define: {
    'process.env': process.env
  },
  server: {
    host: 'local.shockwave.com',
    port: process.env.PORT || 8888
  },
  preview: {
    port: process.env.PORT || 8888
  },
  build: {
    // sourcemap: false,
    // modulePreload: { polyfill: false },
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SWAGSDK',
      fileName: () => 'swag-api.js',
      formats: [ 'iife' ],
    },
    rollupOptions: {
      // external: [
      //   'source-map'
      // ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'swag-api.css';
          return assetInfo.name;
        },
      },
    },
  },
});
