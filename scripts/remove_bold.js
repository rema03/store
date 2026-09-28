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
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace all bold fonts to 400 (normal) to prevent faux bold on pixel fonts
    content = content.replace(/fontWeight:\s*900/g, "fontWeight: 400");
    content = content.replace(/fontWeight:\s*700/g, "fontWeight: 400");
    content = content.replace(/fontWeight:\s*800/g, "fontWeight: 400");
    content = content.replace(/fontWeight:\s*600/g, "fontWeight: 400");
    content = content.replace(/fontWeight:\s*950/g, "fontWeight: 400");
    
    // Also catch string values
    content = content.replace(/fontWeight:\s*['"]900['"]/g, "fontWeight: 400");
    content = content.replace(/fontWeight:\s*['"]700['"]/g, "fontWeight: 400");
    content = content.replace(/fontWeight:\s*['"]bold['"]/g, "fontWeight: 400");
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
        updatedCount++;
    }
});

console.log(`Finished updating ${updatedCount} files.`);
