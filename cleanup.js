const fs = require('fs');
const path = require('path');

const filesToDelete = [
    'public/js/menu-data.js',
    'public/js/menu-data-new.js',
    'js/menu-data-new.js'
];

console.log('🧹 Cleaning up duplicate data files...');

filesToDelete.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ Deleted: ${file}`);
    } else {
        console.log(`ℹ️  Already gone: ${file}`);
    }
});

console.log('✨ Project structure is now clean! "js/menu-data.js" is your Single Source of Truth.');