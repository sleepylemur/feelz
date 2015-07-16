var express = require('express');
var bodyParser = require('body-parser');
var logging = require('morgan');
var serverPort = process.env.PORT || 3000;

var expressJwt = require('express-jwt');

var app = express();
if (process.env.NODE_ENV == 'development') app.use(logging('combined')); //output logging to stderr
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));
app.use('/api', expressJwt({secret: process.env.PANDA_JWT_SECRET}));
var db = require('./db.js')();
var models = require('./models.js')(db);

var http = require('http').Server(app);
var io = require('socket.io')(http);  //pass a http.Server instance

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

var current_users = [];

io.on('connection', function(socket){
  console.log('socket connected');
  socket.on('post', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('addUser', function(data){
    console.log("socket gets new user : "+ data.id);
    current_users.push(data.id)
    console.log("current users "+ current_users);
  });
  socket.on('removeUser', function(data){
    console.log("user signed out, sockets kickes em out: "+ data.id);
    console.log("user just left has an index of : "+ current_users.indexOf(data.id) );
    current_users.splice(current_users.indexOf(data.id), 1);
    console.log(current_users);
  });
});


require('./routes.js')(app,models); // add routes to app
// require('./sockets.js')(app,models); // adding sockets tp app
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
  db: db, // expose db for testing
  models: models
};
