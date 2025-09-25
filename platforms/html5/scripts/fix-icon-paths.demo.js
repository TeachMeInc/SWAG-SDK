
import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve('dist/qa/swag-demo/assets');
const cssFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.css'));
const cssFilePath = path.join(assetsDir, cssFile);

const files = [
  cssFilePath,
  path.resolve('dist/qa/swag-demo/icons/swag-icon.css'),
];

files.forEach((file, idx) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) throw err;
    let updated;
    if (idx === 0) {
      // assets/???.css: reference icons with ../icons/
      updated = data.replace(/url\((["'])?(\.?\/)?assets\/icons\//g, 'url($1../icons/');
      updated = updated.replace(/url\((["'])?\/icons\//g, 'url($1../icons/');
    } else {
      // icons/swag-icon.css: reference icons with ./icons/
      updated = data.replace(/url\((["'])?(\.?\/)?assets\/icons\//g, 'url($1./icons/');
      updated = updated.replace(/url\((["'])?\/icons\//g, 'url($1./icons/');
    }
    fs.writeFile(file, updated, 'utf-8', (err) => {
      if (err) throw err;
    });
  });
});

let css = fs.readFileSync(files[ 0 ], 'utf-8');
css += fs.readFileSync(files[ 1 ], 'utf-8');
fs.writeFileSync(files[ 0 ], css, 'utf-8');

// eslint-disable-next-line no-console
console.log('✓ fixed icon file paths');
