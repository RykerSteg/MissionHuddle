const babel = require('@babel/core');
const fs = require('fs');
const out = babel.transformFileSync('app.jsx', {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  compact: false
});
fs.writeFileSync('app.js', out.code);
console.log('ok', out.code.length);
