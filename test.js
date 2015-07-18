var Db = require('./lib/db.js')();
var db = Db.db;

console.log(typeof db.one === 'function');
