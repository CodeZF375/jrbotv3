const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

let config = {};

try {
  const rawData = fs.readFileSync(configPath);
  config = JSON.parse(rawData);
} catch (err) {
  console.error('Failed to load config.json:', err);
  process.exit(1);
}

module.exports = config;