var Db = require('./lib/db.js')();
var db = Db.db;

var robots = require('./lib/robotusers.js');
robots.start(process.argv[2]);
