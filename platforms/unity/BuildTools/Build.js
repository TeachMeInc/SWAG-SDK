const fs = require('fs-extra'); // You will need the 'fs-extra' package for recursive operations and more.
const path = require('path');
const glob = require('glob').glob;
const archiver = require('archiver'); // This is used for creating zip files.

async function runScript() {
    const rootDir = '.';
    const buildDir = './Build';
    const packagesDir = './Packages/SWAGSDK';
    const exampleProjectDir = './Build/Example Project';
    const releaseDir = './Release';
    const webGLTemplatesDir = './Build/WebGLTemplates';

    // Delete './Release'
    await fs.remove(releaseDir);

    // Delete './Build'
    await fs.remove(buildDir);

    // Create './Build'
    await fs.mkdir(buildDir);

    // Copy './Packages/SWAGSDK' into './Build'
    await fs.copy(packagesDir, buildDir + '/SWAGSDK');

    // Copy './Packages/SWAGSDK/WebGLTemplates' to './Build'
    await fs.copy(path.join(packagesDir, 'WebGLTemplates'), webGLTemplatesDir);

    // Recursively delete all .meta files in './Build/WebGLTemplates'
    const metaFiles = await glob(path.join(webGLTemplatesDir, '**/*.meta'));
    for (const metaFile of metaFiles) {
        await fs.remove(metaFile);
    }

    // Create './Build/Example Project'
    await fs.mkdir(exampleProjectDir);

    // Load .gitignore into memory
    const gitignoreContent = await fs.readFile(path.join(rootDir, '.gitignore'), 'utf8');
    const ignorePatterns = gitignoreContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
    ignorePatterns.push('BuildTools');
    ignorePatterns.push('package-lock.json');
    ignorePatterns.push('package.json');

    // Recursively copy '.' into './Build/Example Project', excluding .gitignore listed files
    const exampleProjectfiles = await glob('*', {
        cwd: rootDir,
        ignore: ignorePatterns
    });

    for (const file of exampleProjectfiles) {
        const src = path.join(rootDir, file);
        const dest = path.join(exampleProjectDir, file);

        await fs.copy(src, dest);
    }

    // Create './Release'
    await fs.ensureDir(releaseDir); // This creates the folder if it doesn't exist.

    // Load package.json into a variable
    const packageJSON = await fs.readJson(path.join(packagesDir, 'package.json'));

    // Zip './Build' into './Release/SWAG Unity SDK (v{version} {unity}-{unityRelease}).zip'
    const outputZipPath = path.join(releaseDir, `SWAG Unity SDK (v${packageJSON.version} ${packageJSON.unity}-${packageJSON.unityRelease}).zip`);
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Compression level.
    });

    output.on('close', function() {
        console.log(Math.round((archive.pointer() / 1024)).toLocaleString() + ' total kb');
        console.log(`Release archive file created at ${outputZipPath}.`);
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);
    archive.directory(buildDir, false);
    archive.finalize();
}

runScript().catch(err => {
    console.error('An error occurred:', err);
});
