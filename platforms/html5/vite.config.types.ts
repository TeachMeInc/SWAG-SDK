// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    preact({
      reactAliasesEnabled: false,
    }),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  assetsInclude: [ '**/*.handlebars' ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SWAGAPI',
      formats: [ 'es' ],
      fileName: 'swag-api',
    },
    outDir: './types',
    emptyOutDir: true,
  },
});
