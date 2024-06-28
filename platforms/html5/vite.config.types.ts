// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
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
