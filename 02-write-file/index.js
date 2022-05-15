const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Hello, what are your name: ',
});

const writeStream = fs.createWriteStream('file.txt');

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
