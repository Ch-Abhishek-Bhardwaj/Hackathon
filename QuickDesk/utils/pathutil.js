const path = require('path');

// Gives the directory of the main module (entry point like app.js)
module.exports = path.dirname(require.main.filename);
