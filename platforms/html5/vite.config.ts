// @ts-nocheck

import { ResolvedConfig, defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import mkcert from 'vite-plugin-mkcert';
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
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SWAGSDK',
      fileName: () => 'swag-api.js',
      formats: [ 'iife' ],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'swag-api.css';
          return assetInfo.name;
        },
      },
    },
  },
});
