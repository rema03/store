const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('/Users/jimin/web_service/store/src');
let updatedCount = 0;

files.forEach(file => {
    // Skip page.tsx since we already rewrote it heavily
    if (file.endsWith('app/page.tsx')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace colors
    content = content.replace(/#c2410c/gi, '#000000');
    content = content.replace(/#a3370a/gi, '#333333');
    content = content.replace(/#fafaf8/gi, '#ffffff');
    content = content.replace(/#f5f0e8/gi, '#ffffff');
    content = content.replace(/#f3efe8/gi, '#ffffff');
    content = content.replace(/#ebe3d7/gi, '#ffffff');
    content = content.replace(/#f0ebe3/gi, '#ffffff');
    content = content.replace(/#e8e2d8/gi, '#000000');
    content = content.replace(/#6b6560/gi, '#666666');
    content = content.replace(/#7e7468/gi, '#666666');
    content = content.replace(/#1a1a1a/gi, '#000000');
    
    // Increase border thickness and remove border radius for brutalist look
    content = content.replace(/border:\s*'1px solid #000000'/g, "border: '2px solid #000000'");
    content = content.replace(/borderRadius:\s*['"]\d+px['"]/g, "borderRadius: '0px'");
    content = content.replace(/borderRadius:\s*['"]50%['"]/g, "borderRadius: '0px'");
    content = content.replace(/borderRadius:\s*['"]999px['"]/g, "borderRadius: '0px'");
    
    // Add solid shadow replacements
    content = content.replace(/boxShadow:\s*'0 1px 3px [^']+'/g, "boxShadow: '4px 4px 0px #000000'");
    content = content.replace(/boxShadow:\s*'0 4px 12px [^']+'/g, "boxShadow: '6px 6px 0px #000000'");
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
        updatedCount++;
    }
});

console.log(`Finished updating ${updatedCount} files.`);
