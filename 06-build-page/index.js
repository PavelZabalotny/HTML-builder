const fs = require('fs');
const path = require('path');

const pathTemplate = path.join(__dirname, 'template.html');
const pathComponents = path.join(__dirname, 'components');
const pathProject = path.join(__dirname, 'project-dist');
const pathStyle = path.join(__dirname, 'styles');
const pathStyleDest = path.join(pathProject, 'style.css');
const pathSrc = path.join(__dirname, 'assets');
const pathDest = path.join(pathProject, 'assets');

function error(err) {
  if (err) {
    throw err.message;
  }
}

async function readDir(pathSrc, pathDest) {
  await fs.promises.rm(pathDest, { recursive: true, force: true });
  const readAssets = await fs.promises.readdir(pathSrc, { withFileTypes: true });
  readAssets.forEach((dirent) => {
    if (dirent.isDirectory()) {
      const currentPath = path.join(pathSrc, dirent.name);
      const createPathDest = path.join(pathDest, dirent.name);
      readDir(currentPath, createPathDest);
    } else if (dirent.isFile()) {
      const fileSrc = path.join(pathSrc, dirent.name);
      const fileDest = path.join(pathDest, dirent.name);
      fs.promises.mkdir(pathDest, { recursive: true })
        .then(() => {
          fs.promises.copyFile(fileSrc, fileDest).then(() => {
            console.log(`${dirent.name} is copy from ${fileSrc} to ${fileDest}`);
          })
            .catch(error);
        })
        .catch(error);
    }
  });
}

async function main() {
  const templateData = await fs.promises.readFile(pathTemplate);
  /**
   * read all file in components path
   * @type {Dirent[]}
   */
  const dirents = await fs.promises.readdir(pathComponents, { withFileTypes: true });
  const files = dirents.map(({ name }) => name.split('.')[0]);
  /**
   * create array of objects like {pending Promise(file: footer, payload: html layout)}
   */
  let templateString = templateData.toString();
  const newFiles = files.map(async (file) => ({
    file,
    payload: await fs.promises.readFile(path.join(pathComponents, `${file}.html`), { encoding: 'utf-8' })
  }));
  /**
   * replace all Promise to object
   * @type {Awaited<{file: *, payload: Buffer}>[]}
   */
  const objectForReplace = await (async () => {
    return Promise.all(newFiles);
  })();
  const arrTemp = [templateString];
  /**
   * replace all tags like {{footer}} to html
   */
  objectForReplace.forEach(({ file, payload }) => {
    const pattern = `{{${file}}}`;
    arrTemp.push(arrTemp.shift().replace(new RegExp(pattern, 'g'), payload.toString()));
  });
  const newTemplate = arrTemp[0];
  /**
   * create project-dist folder
   */
  fs.mkdir(pathProject, { recursive: true }, (err) => {
    if (err) throw err.message;
    console.log(`directory ${pathProject} - is created`);
    /**
     * write modified template.html to project-dist folder
     */
    fs.writeFile(path.join(pathProject, 'template.html'), newTemplate, (err) => {
      if (err) throw err.message;
      /**
       * create styles.css in project-dist folder
       */
      bundle();
      /**
       * copy assets in project-dist folder
       */
      readDir(pathSrc, pathDest);
    });
  });
}

async function bundle() {
  const files = await fs.promises.readdir(pathStyle, { withFileTypes: true });
  const writeStream = fs.createWriteStream(pathStyleDest);

  files.forEach(file => {
    const fileExt = path.parse(file.name).ext;

    if (file.isFile() && fileExt === '.css') {
      const pathFile = path.join(pathStyle, file.name);
      const readStream = fs.createReadStream(pathFile, { encoding: 'utf-8' });

      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });

      console.log(`${file.name} - is wrote on ${pathStyleDest}!`);
    }
  });
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.log(e.message);
  }
})();
