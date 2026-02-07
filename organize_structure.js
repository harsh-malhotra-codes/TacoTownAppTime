const fs = require('fs');
const path = require('path');

console.log('🏗️  Organizing Project Structure...');

// 1. Create directories
const dirs = ['backend', 'public/js'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// 2. Define file moves
const moves = [
    // Backend files
    { src: 'server.js', dest: 'backend/server.js' },
    { src: 'js/menu-data.js', dest: 'backend/menu-data.js' },
    
    // Frontend files
    { src: 'js/reviews.js', dest: 'public/js/reviews.js' },
    { src: 'admin.html', dest: 'public/admin.html' }
];

// 3. Execute moves
moves.forEach(move => {
    const srcPath = path.join(__dirname, move.src);
    const destPath = path.join(__dirname, move.dest);
    
    if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
        console.log(`✅ Moved: ${move.src} -> ${move.dest}`);
    } else {
        console.log(`⚠️  Skipped (not found): ${move.src}`);
    }
});

console.log('\n✨ Restructuring complete!');
console.log('👉 IMPORTANT: Run "node backend/server.js" to start your server now.');