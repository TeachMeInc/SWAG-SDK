import { readFileSync, writeFileSync } from 'node:fs';
import pkg from '../package.json' assert { type: 'json' };

const src = 'types/swag-api.d.ts';
const dst = 'types/swag-api.d.ts';
let text = readFileSync(src, 'utf8');

// Strip any stray import/export lines and 'export ' keywords
text = text
  .replace(/^\s*import\s+.*?;?\s*$/gm, '')
  .replace(/^\s*export\s+type\s+{[^}]*};?\s*$/gm, '')
  .replace(/^\s*export\s+{[^}]*};?\s*$/gm, '')
  .replace(/\bexport\s+(declare\s+)?/g, '$1');

text = `/* eslint-disable */
// Type definitions for SWAG HTML5 SDK v${pkg.version}
// Visit https://developers.shockwave.com for more information

${text}
`;

writeFileSync(dst, text);
// eslint-disable-next-line no-console
console.log(`Wrote ${dst}`);
