const fs = require('fs');
const chokidar = require('chokidar');

chokidar.watch('./Packages/SWAGSDK/WebGLTemplates').on('all', (event, path) => {
  console.log(event, path);
});
