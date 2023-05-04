const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = require('process');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
stdout.write('Введите текст для записи в файл: ');
stdin.on('data', data => {
  if (data.toString().toLowerCase().trim() === 'exit') {
    goOut();
  }
  writeStream.write(data);
})

process.on('SIGINT', goOut);

function goOut() {
  stdout.write('Досвидания!');
  exit();
}