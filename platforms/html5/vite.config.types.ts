// @ts-nocheck

import { defineConfig } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import dts from 'vite-plugin-dts';
import vitePluginSVGToFont from '@sumsolution/vite-plugin-svg-to-font';

export default defineConfig({
  plugins: [
    preact({
      reactAliasesEnabled: false,
    }),
    vitePluginSVGToFont({
      svgPath: resolve(__dirname, 'icons'),
      fontName: 'swag-icon',
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
