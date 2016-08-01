'use strict';

let fs = require('fs');
let json = JSON.parse(fs.readFileSync(__dirname + '/.babelrc', 'utf8'));
json.presets = json.presets.map((preset) => {
    return require.resolve('babel-preset-' + preset);
});

// For IE8
// "plugins": ["transform-es3-member-expression-literals", "transform-es3-property-literals"]
// json.plugins = json.plugins.map((plugin) => {
//     return require.resolve('babel-plugin-' + plugin);
// });

module.exports = json;
