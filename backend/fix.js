const fs = require('fs');

const files = ['User', 'Donor', 'Request', 'DonorHistory', 'Activity'];

for (const f of files) {
    const path = `d:/webD/lifelink/backend/models/${f}.js`;
    let content = fs.readFileSync(path, 'utf8');
    
    // Replace async function(next) with async function()
    content = content.replace(/async function\(next\)/g, 'async function()');
    
    // Replace next(); before });
    content = content.replace(/ \n    next\(\);\n\}\);/g, '\n});');
    // More robust replacement just in case
    content = content.replace(/    next\(\);\n\}\);/g, '});');
    
    fs.writeFileSync(path, content);
    console.log(`Fixed ${f}.js`);
}
