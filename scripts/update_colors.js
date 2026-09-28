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
    
    content = content.replace(/color:\s*'#171512'/g, "color: '#1a1a1a'");
    content = content.replace(/background:\s*'#171512'/g, "background: '#c2410c'");
    content = content.replace(/border:\s*'1px solid #171512'/g, "border: '1px solid #c2410c'");
    content = content.replace(/borderColor:\s*'#171512'/g, "borderColor: '#c2410c'");
    content = content.replace(/accentColor:\s*'#171512'/g, "accentColor: '#c2410c'");
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
        updatedCount++;
    }
});

console.log(`Finished updating ${updatedCount} files.`);
