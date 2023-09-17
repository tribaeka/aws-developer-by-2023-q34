const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

delete packageJson.devDependencies;

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
