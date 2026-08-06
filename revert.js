const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /dark:bg-noir-bg bg-zinc-50/g, to: 'bg-noir-bg' },
  { from: /dark:text-white text-zinc-900/g, to: 'text-white' },
  { from: /dark:text-zinc-400 text-zinc-600/g, to: 'text-zinc-400' },
  { from: /dark:bg-noir-surface bg-zinc-100/g, to: 'bg-noir-surface' },
  { from: /dark:border-zinc-800 border-zinc-200/g, to: 'border-zinc-800' },
  { from: /dark:text-zinc-300 text-zinc-800/g, to: 'text-zinc-300' },
  { from: /dark:bg-zinc-800 bg-zinc-200/g, to: 'bg-zinc-800' },
  { from: /dark:bg-noir-card bg-white/g, to: 'bg-noir-card' },
  { from: /dark:text-zinc-500 text-zinc-500/g, to: 'text-zinc-500' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let totalReplaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplaced++;
    console.log(`Reverted in ${file}`);
  }
});

console.log(`Done. Modified ${totalReplaced} files.`);
