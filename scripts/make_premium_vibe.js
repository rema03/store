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
    
    // Change harsh borders to soft borders
    content = content.replace(/border:\s*'2px solid #000000'/g, "border: '1px solid rgba(0,0,0,0.08)'");
    content = content.replace(/border:\s*'1px solid #000000'/g, "border: '1px solid rgba(0,0,0,0.08)'");
    
    // Change 0px radius to 16px (smooth corners)
    content = content.replace(/borderRadius:\s*'0px'/g, "borderRadius: '16px'");
    
    // Change brutalist shadows to soft modern shadows
    content = content.replace(/boxShadow:\s*'4px 4px 0px #000000'/g, "boxShadow: '0 8px 24px rgba(0,0,0,0.04)'");
    content = content.replace(/boxShadow:\s*'6px 6px 0px #000000'/g, "boxShadow: '0 12px 32px rgba(0,0,0,0.06)'");
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
        updatedCount++;
    }
});

console.log(`Finished updating ${updatedCount} files.`);
