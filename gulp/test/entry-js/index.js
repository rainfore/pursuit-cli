let context = require.context('../../', true, /test\/spec.js$/);
context.keys().forEach(context);
module.exports = context;
