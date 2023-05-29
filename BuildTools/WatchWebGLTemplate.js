const fs = require('fs');
const chokidar = require('chokidar');

let debounce = null;
let numChanges = 0;

chokidar.watch('./Packages/SWAGSDK/WebGLTemplates/SWAGSDK').on('all', (event, path) => {
  numChanges++;
  
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    console.clear();
    console.log(`${numChanges} changes detected (${(new Date()).toLocaleTimeString()}):`);
    console.log(' - Removing existing assets...')

    fs.rmSync(
      './Assets/WebGLTemplates/SWAGSDK', 
      { 
        recursive: true
      },
      (err) => {
        if (err) console.log(err);
      }
    );

    console.log(' - Copying new assets...')
    
    fs.cpSync(
      './Packages/SWAGSDK/WebGLTemplates/SWAGSDK',
      './Assets/WebGLTemplates/SWAGSDK', 
      { 
        recursive: true,
        force: true, 
      },
      (err) => {
        if (err) console.log(err);
      }
    );

    console.log('...done!')

    numChanges = 0;
  }, 200);
});
