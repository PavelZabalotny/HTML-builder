const path = require('path');
const fs = require('fs');

const pathDest = path.join(__dirname, 'files-copy');
const pathSrc = path.join(__dirname, 'files');

function readFolder(pathSrc, pathDest) {
  fs.promises.readdir(pathDest, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (file.isFile()) {
          fs.unlink(path.join(pathDest, file.name), (err) => {
            if (err) {
              throw err;
            }
            console.log(`${file.name} - was deleted!!!`);
          });
        }
      });
    })
    .then(() => {
      fs.promises.readdir(pathSrc, { withFileTypes: true }).then((files) => {
        files.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(pathSrc, file.name), path.join(pathDest, file.name), (err) => {
              if (err) {
                throw err;
              }
            });
            console.log(`${file.name} - was copied!!!`);
          }
        });
      });
    })
    .catch((err) => {
      throw err;
    });
}

fs.mkdir(pathDest, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
  readFolder(pathSrc, pathDest);
});
