const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

var content = fs.readFileSync('./manifest.json');
var manifest = JSON.parse(content);
var zipFilename = 'package-' + manifest.version;
var fullpath = './packages/' + zipFilename + '.zip';
var resources = {
    folders: [
        '_locales',
        'css',
        'img',
        'js',
        'lib',
        'pages/dist'
    ],
    files: [
        'background.js',
        'icon.png',
        'icon16.png',
        'icon48.png',
        'icon128.png',
        'manifest.json',
        'popup.html'
    ]
};

var output = fs.createWriteStream(fullpath);
var zip = archiver('zip', {
    zlib: { level: 9 }
});

output.on('close', function () {
    console.log(zip.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

zip.pipe(output);

resources.folders.forEach(function (folder) {
    console.log('Package folder \'' + folder + '\'');
    zip.directory(folder, folder);
});

resources.files.forEach(function (file) {
    console.log('Package file \'' + file + '\'');
    zip.file(file, {
        name: file
    });
});

zip.finalize();

console.log('Package complete \'' + fullpath + '\'')
