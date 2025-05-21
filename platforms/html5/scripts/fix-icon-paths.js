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
      /url\(["']?\/icons\//g,
      'url(\'/dist/icons/'
    );

    fs.writeFile(file, updated, 'utf-8', (err) => {
      if (err) throw err;
    });
  });
});

// eslint-disable-next-line no-console
console.log('✓ fixed icon file paths');
