// @ts-nocheck

import Handlebars from 'handlebars';
import { promises as fs } from 'fs';

const fileRegex = /\.(handlebars)$/;

interface VitePluginHandlebarsOptions {
}

export default function vitePluginHandlebars (opts: VitePluginHandlebarsOptions) {
  return {
    name: 'vite-plugin-handlebars',

    transform (src: string, id: string) {
      if (fileRegex.test(id)) {
        return {
          code: 'export default ' + Handlebars.precompile(src) + ';',
          map: null,
        };
      }
    },
  };
}
