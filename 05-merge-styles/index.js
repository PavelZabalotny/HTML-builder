const fs = require('fs');
const path = require('path');

const pathStyle = path.join(__dirname, 'styles');
const pathDest = path.join(__dirname, 'project-dist', 'bundle.css');


async function bundle() {
  const files = await fs.promises.readdir(pathStyle, { withFileTypes: true });
  const writeStream = fs.createWriteStream(pathDest);
  
  files.forEach(file => {
    const fileExt = path.parse(file.name).ext;

    if (file.isFile() && fileExt === '.css') {
      const pathFile = path.join(pathStyle, file.name);
      const readStream = fs.createReadStream(pathFile, { encoding: 'utf-8' });

      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });

      console.log(`${file.name} - is wrote!`);
    }

  });
}

(async () => {
  await bundle();
})();
