import { readFileSync, writeFileSync } from 'node:fs';

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
// This file is generated from Shockwave SDK module typings. Visit https://developers.shockwave.com for more information.

${text}
`;

writeFileSync(dst, text);
// eslint-disable-next-line no-console
console.log(`Wrote ${dst}`);
