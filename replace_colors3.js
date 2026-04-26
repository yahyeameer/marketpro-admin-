const fs = require('fs');
const path = require('path');

const replacements = [
  // 1. Gradients to placeholder
  { search: /bg-gradient-to-br from-\[#ffffff\] to-\[[^\]]+\]/g, replace: '__PRIMARY_BTN__' },
  { search: /from-\[#ffffff\] to-\[[^\]]+\]/g, replace: '__PRIMARY_BTN__' },
  
  // 2. Structural backgrounds
  { search: /bg-\[#09090b\]\/[0-9]+/g, replace: 'bg-[#ffffff]' },
  { search: /bg-\[#09090b\]/g, replace: 'bg-[#ffffff]' },
  { search: /bg-\[#18181b\]\/[0-9]+/g, replace: 'bg-[#ffffff]' },
  { search: /bg-\[#18181b\]/g, replace: 'bg-[#ffffff]' },
  { search: /bg-\[#27272a\]/g, replace: 'bg-[#f4f4f5]' },
  { search: /bg-\[#23233b\]/g, replace: 'bg-[#e4e4e7]' },
  
  // 3. Text colors
  { search: /text-\[#fafafa\]/g, replace: 'text-[#09090b]' },
  { search: /text-\[#a1a1aa\]/g, replace: 'text-[#71717a]' },
  { search: /text-white\/50/g, replace: 'text-[#09090b]/50' },
  { search: /text-white\/40/g, replace: 'text-[#09090b]/40' },
  { search: /text-white\/70/g, replace: 'text-[#09090b]/70' },
  { search: /text-white\/90/g, replace: 'text-[#09090b]/90' },
  { search: /hover:text-white/g, replace: 'hover:text-[#09090b]' },
  { search: /text-white/g, replace: 'text-[#09090b]' },
  
  // 4. Borders and overlays
  { search: /border-white\/10/g, replace: 'border-[#09090b]/10' },
  { search: /border-white\/5/g, replace: 'border-[#09090b]/5' },
  { search: /border-\[#27272a\]\/30/g, replace: 'border-[#e4e4e7]' },
  { search: /border-\[#27272a\]\/50/g, replace: 'border-[#e4e4e7]' },
  { search: /border-\[#27272a\]/g, replace: 'border-[#e4e4e7]' },
  { search: /bg-white\/5/g, replace: 'bg-[#09090b]/5' },
  { search: /bg-white\/10/g, replace: 'bg-[#09090b]/10' },
  { search: /bg-white\/20/g, replace: 'bg-[#09090b]/10' },

  // 5. Restore primary buttons
  { search: /__PRIMARY_BTN__ text-\[#09090b\]/g, replace: 'bg-[#09090b] text-white' },
  { search: /__PRIMARY_BTN__/g, replace: 'bg-[#09090b] text-white' },
];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'src'));

let modifiedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  replacements.forEach(({ search, replace }) => {
    newContent = newContent.replace(search, replace);
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Total files updated: ${modifiedFiles}`);
