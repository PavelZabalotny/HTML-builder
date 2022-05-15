const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(path.resolve(), 'secret-folder');

async function readFolder(folder) {
  try {
    const files = await fs.promises.readdir(folder, { withFileTypes: true });
    files.forEach(file => {
      if (file.isFile()) {
        const fileStats = path.parse(file.name);
        const fileName = fileStats.name;
        const fileExt = fileStats.ext.substring(1);

        fs.stat(path.join(folder, file.name), (error, stats) => {
          if (error) {
            console.log(error);
            throw new Error(error.message);
          } else {
            console.log(`${fileName} - ${fileExt} - ${stats.size} byte`);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

readFolder(pathToFolder).then();
