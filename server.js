var cp = require('child_process');
require('ts-node').register({ /* options */ })
require('./app.ts');
var server = cp.fork('./bin/www');
console.log('ready')