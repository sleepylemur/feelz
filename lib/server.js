var express = require('express');
var bodyParser = require('body-parser');
var logging = require('morgan');
var serverPort = process.env.PORT || 3000;

var expressJwt = require('express-jwt'); 

var app = express();
app.use(logging('combined')); //output logging to stderr
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use('/api', expressJwt({secret:"e5yjejeyj5ut45uuuu6j6jr"}));
var db = require('./db.js')();

var models = require('./models.js')(db);

require('./routes.js')(app,models); // add routes to app

var server; // used for stopping and starting express

// unused, but seems like the well-mannered thing to do
// allow the process getting shutdown gracefully
process.on('SIGTERM', function() {
  server.stop();
});

// export start and stop functions
module.exports = {
  start: function() {
    server = app.listen(serverPort);
    console.log("listening on 3000");
  },
  stop: function() {
    server.stop();
  },
  app: app, // expose app for testing
  db: db // expose db for testing
};
