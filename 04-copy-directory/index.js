const fs = require('fs');
const path = require('path');
const fsPromises = require('node:fs/promises');

let dirFrom = path.resolve(__dirname, 'files');
console.log(dirFrom);
let dirTo = path.resolve(__dirname, 'files-copy');

function nothingFrom() {
  fs.promises.readdir(dirTo).then(files => files.forEach(file => {
    let filesNothing = path.resolve(dirTo, file);
    fsPromises.unlink(filesNothing);
  }));
};

function copyDir() {
  fsPromises.mkdir(path.join(dirTo), { recursive: true });
  nothingFrom();
  fsPromises.readdir(dirFrom).then(files => files.forEach(file => {
    let fileDirFrom = path.resolve(dirFrom, file);
    let fileDirTo = path.resolve(dirTo, file);
    fsPromises.copyFile(fileDirFrom, fileDirTo);
  }));
};

copyDir();