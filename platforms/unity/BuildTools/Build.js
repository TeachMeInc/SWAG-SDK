const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const archiver = require('archiver');

async function main() {
    const baseDir = path.resolve('.');
    const buildDir = path.join(baseDir, 'Build');
    const releaseDir = path.join(baseDir, 'Release');
    const swagSDKPath = path.join(baseDir, 'Packages', 'SWAGSDK');
    const packageJsonPath = path.join(swagSDKPath, 'package.json');

    // Delete './Build' folder
    await fs.remove(buildDir);

    // Create './Build' folder
    await fs.ensureDir(buildDir);

    // Copy './Packages/SWAGSDK' to './Build'
    await fs.copy(swagSDKPath, path.join(buildDir, 'SWAGSDK'));

    // Create './Build/Example Project'
    await fs.ensureDir(path.join(buildDir, 'Example Project'));

    // Load .gitignore
    const gitignore = await fs.readFile(path.join(baseDir, '.gitignore'), 'utf-8');
    const ignorePatterns = gitignore.split('\n').filter(line => line.trim() && !line.startsWith('#'));

    // Copy and filter the contents of '.' to './Build/Example Project'
    glob('**/*', {
        cwd: baseDir,
        ignore: ignorePatterns,
        dot: true
    }, (err, files) => {
        if (err) throw err;
        files.forEach(async file => {
            const src = path.join(baseDir, file);
            const dest = path.join(buildDir, 'Example Project', file);
            await fs.copy(src, dest);
        });
    });

    // Copy './Packages/SWAGSDK/WebGLTemplates' to './Build'
    await fs.copy(path.join(swagSDKPath, 'WebGLTemplates'), path.join(buildDir, 'WebGLTemplates'));

    // Create './Release' folder
    await fs.ensureDir(releaseDir);

    // Load package.json from './Packages/SWAGSDK' into a variable
    const packageJson = await fs.readJson(packageJsonPath);

    // Zip './Build' into './Release/SWAG Unity SDK (v{version} {unity}-{unityRelease}).zip'
    const zipPath = path.join(releaseDir, `SWAG Unity SDK (v${packageJson.version} ${packageJson.unity}-${packageJson.unityRelease}).zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Compression level
    });

    output.on('close', () => {
        console.log(`Zipped to ${zipPath} successfully!`);
    });

    archive.on('error', err => {
        throw err;
    });

    archive.pipe(output);
    archive.directory(buildDir, false);
    archive.finalize();
}

main().catch(err => {
    console.error('An error occurred:', err);
});