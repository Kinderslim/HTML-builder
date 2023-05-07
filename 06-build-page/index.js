const fs = require('fs');
const path = require('path');
const fsPromises = require('node:fs/promises');

// Create dir project-dist

fsPromises.mkdir(path.resolve(__dirname, 'project-dist'), { recursive: true });

// Create style.css in dir project-dist

function createCssFile() {
  let dirFrom = path.resolve(__dirname, 'styles');
  let writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));

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
}

createCssFile();

// Create index.html in dir project-dist

function createHtmlFile() {
  let readStream = fs.createReadStream(path.resolve(__dirname, 'template.html'));
  fsPromises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), '');

  let merge = () => {
    readStream.on('data', data => {
      let templateHtml = data.toString().trim();
      let dirFrom = path.resolve(__dirname, 'components');
      fsPromises.readdir(dirFrom, { withFileTypes: true }).then(files => files.forEach(file => {
        if (file.isFile()) {
          let componentPath = path.resolve(__dirname, 'components', file.name);
          let componentName = path.basename(componentPath);
          let componentTag = componentName.replace(path.extname(componentPath), '');
          let readStreamComponents = fs.createReadStream(componentPath);
          readStreamComponents.on('data', data => {
            let templateToDir = data.toString().trim();
            templateHtml = templateHtml.replace('{{' + componentTag + '}}', templateToDir);
            fsPromises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), templateHtml);
          })
        }
      }));
    })
  };

  merge();
}

createHtmlFile();

// Copy assets in dir project-dist

function copyAsset () {
  let dirFrom = path.resolve(__dirname, 'assets');
  let dirTo = path.resolve(__dirname, 'project-dist', 'assets');

  function copyDir(directoryFrom, directoryTo) {
    fsPromises.mkdir(directoryTo, { recursive: true });
    fsPromises.readdir(directoryFrom, { withFileTypes: true }).then(files => files.forEach(file => {
      let nextDirFrom = path.resolve(directoryFrom, file.name);
      let nextDirTo = path.resolve(directoryTo, file.name);
      if (file.isDirectory()) {
        fsPromises.mkdir(nextDirTo, {recursive: true});
        copyDir(nextDirFrom, nextDirTo);
      } else if (file.isFile()) {
          fsPromises.copyFile(nextDirFrom, nextDirTo);
        }
    }));
  };

  copyDir(dirFrom, dirTo);
};

copyAsset();