import fs from 'fs';
import path from 'path';

const files = [
  path.resolve('dist/swag-api.css'),
  path.resolve('dist/icons/swag-icon.css'),
];

files.forEach((file) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) throw err;

    const updated = data.replace(
      /url\((["'])?\/icons\//g,
      'url($1./icons/'
    );

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
