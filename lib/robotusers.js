var faker = require('faker');
var Promise = require('bluebird');
var request = require('superagent');

var robotrants = ["life as a robot sucks","too many humans here. i hate it!","beep boop","#T@(*U@T"];
var serverurl;
if (process.env.NODE_ENV === 'production') serverurl = 'https://pandastaging.herokuapp.com';
else serverurl = 'http://localhost:3000';

// var ioClient = require('socket.io-client');


function Robot() {
  this.lat = 40.7652074;
  this.lng = -73.9727593;
  this.speed = 0.001;
  this.turnspeed = 0.3;
  this.dir = Math.random()*2*Math.PI;
  this.username = faker.name.findName();
  this.email = faker.internet.email();
  this.password = faker.internet.password();

  this.signup = function() {
    var me = this;
    request
      .post(serverurl+'/signup')
      .send({
        username: me.username,
        email: me.email,
        password: me.password,
        confirmpassword: me.confirmpassword
      }).end(function(err,res) {
        me.token = res.body.token;
        // me.socket = ioClient.connect(serverurl);
      });
  };

  this.move = function() {
    this.dir += Math.random()*this.turnspeed*2 - this.turnspeed;
    this.lat += this.speed * Math.sin(this.dir);
    this.lng += this.speed * Math.cos(this.dir);
  };

  this.ping = function() {
    if (this.token) {
      var rant = robotrants[Math.floor(Math.random()*robotrants.length)];
      // this.socket.emit('new post', { rant: rant });
      request
        .post(serverurl+'/api/posts')
        .set({Authorization: "Bearer "+this.token})
        .send({
          emotion: 'rant',
          message: rant,
          lat: this.lat,
          lng: this.lng
        }).end(function(err,res) {
          if (err) console.log(err);
        });
    }
  };
}


function Robots() {
  this.robot = new Robot();
  this.robot.signup();
  this.talk = function() {
    console.log('beep');
  };
  this.start = function() {
    if(this.timer) clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 500);
  };

  this.tick = function() {
    this.robot.move();
    this.robot.ping();
  };
}

module.exports = new Robots();
