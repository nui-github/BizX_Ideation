import fs from 'fs';
const lines = fs.readFileSync('temp.txt', 'utf8').split('\n');
console.log(lines.slice(0, 30).join('\n'));
