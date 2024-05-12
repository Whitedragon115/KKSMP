const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const nowdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '-');
const output = fs.createWriteStream(path.join(__dirname, `[ ZIP FILE ]/KKSMP-${nowdate}.zip`));
const archive = archiver('zip', { zlib: { level: 5 } });

output.on('close', () => { console.log(`Archive created. Total bytes: ${archive.pointer()}`) });
archive.on('error', (err) => { throw err });
archive.pipe(output);

const archive_file = ['index.js', 'config.json', 'package.json', 'deploy.js', '.env'];
const acchive_folder = ['commands', 'events', 'function', 'util'];

for (const file of archive_file) {
    archive.file(path.join(__dirname, file), { name: file })
}

for (const folder of acchive_folder) {
    archive.directory(path.join(__dirname, folder), folder)
}

archive.finalize();



