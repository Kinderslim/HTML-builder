const fs = require('fs');
const path = require('path');
const fsPromises = require('node:fs/promises');
fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}).then(data => {
  data.forEach(files => {
    if (files.isFile()) {
      let exitPath = path.join(__dirname, 'secret-folder', files.name);
      let exitExt = path.extname(exitPath).replace('.', '');
      let exitName = path.basename(exitPath).replace('.' + exitExt, '');
      fsPromises.stat(exitPath).then(result => {
        let exitSize = (result.size / 1024).toFixed(1);
        console.log(exitName,'-',exitExt,'-',exitSize,'kb');
      });
    }
  });
});