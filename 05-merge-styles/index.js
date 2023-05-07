const fs = require('fs');
const path = require('path');
const fsPromises = require('node:fs/promises');

let dirFrom = path.resolve(__dirname, 'styles');
let writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));

let merge = () => {
  fsPromises.readdir(dirFrom, { withFileTypes: true }).then(files => files.forEach(file => {
    if (file.isFile()) {
      if (path.extname(path.resolve(__dirname, 'styles', file.name)) === '.css') {
        let readStream = fs.createReadStream(path.resolve(__dirname, 'styles', file.name));
        readStream.on('data', data => {
            writeStream.write(data.toString() + '\n');
        })
      }
    }
  }));
};

merge();