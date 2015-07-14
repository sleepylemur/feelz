var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

var server = app.listen(3000);


// allow the server to be shutdown if needed
process.on('SIGTERM', function() {
  server.stop();
});

// console.log(process.env.NODE_ENV);
