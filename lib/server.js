var express = require('express');
var bodyParser = require('body-parser');
var logging = require('morgan');
var serverPort = process.env.PORT || 3000;

var expressJwt = require('express-jwt');

var app = express();
if (process.env.NODE_ENV == 'development') app.use(logging('combined', {
  skip: function (req, res) { return res.statusCode < 400 } // only log errors
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use('/api', expressJwt({secret: process.env.PANDA_JWT_SECRET}));
var Db = require('./db.js')();

var http = require('http').Server(app);
var io = require('socket.io')(http);  //pass a http.Server instance

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

var current_users = [];



require('./routes.js')(app,Db,io); // add routes to app
var server; // used for stopping and starting express

// unused, but seems like the well-mannered thing to do
// allow the process getting shutdown gracefully
process.on('SIGTERM', function() {
  if (server) server.close();
});

// export start and stop functions
module.exports = {
  start: function() {
    server = http.listen(serverPort);
    // app.listen(serverPort);
    console.log("listening on 3000");
  },
  stop: function() {
    server.close();
  },
  app: app, // expose app for testing
  Db: Db // expose db for testing
};
