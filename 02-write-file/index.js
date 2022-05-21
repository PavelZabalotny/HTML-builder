const readline = require('readline');
const fs = require('fs');
const path = require('path');

const pathDest = path.join(__dirname, 'file.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Type some text: ',
});

rl.prompt();

const writeStream = fs.createWriteStream(pathDest);

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
  } else {
    rl.prompt();
    writeStream.write(`${line}\n`);
  }
});

rl.on('close', () => {
  console.log('\nHave a great day!');
  process.exit(0);
});
