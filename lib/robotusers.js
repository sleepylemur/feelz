var faker = require('faker');
var Promise = require('bluebird');
var request = require('superagent');

var robotrants = ["life as a robot sucks","too many humans here. i hate it!","beep boop","#T@(*U@T"];
var serverurl;
if (process.env.NODE_ENV === 'production') serverurl = 'https://pandastaging.herokuapp.com';
else serverurl = 'http://localhost:3000';

// var ioClient = require('socket.io-client');


function Robot() {
  this.origlat = 40.7652074 + Math.random()*0.1;
  this.origlng = -73.9727593 + Math.random()*0.1;
  this.lat = this.origlat;
  this.lng = this.origlng;
  this.speed = 0.001;
  this.turnspeed = 0.4;
  this.homingspeed = 0.01;
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

    // gravitate towards origin
    var origindir = Math.atan2(this.origlat - this.lat, this.origlng - this.lng);
    var dtheta = this.dir - origindir;
    if (dtheta > Math.PI) origindir += 2*Math.PI;
    else if (dtheta < -Math.PI) origindir -= 2*Math.PI;
    this.dir += (origindir - this.dir) * this.homingspeed;

    // keep this.dir within [-pi,pi]
    if (this.dir > Math.PI) this.dir -= 2*Math.PI;
    else if (this.dir < -Math.PI) this.dir += 2*Math.PI;

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
  this.robots = [];
  for (var i=0; i<10; i++) {
    var r = new Robot();
    r.signup();
    this.robots.push(r);
  }

  this.start = function() {
    if(this.timer) clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 20);
  };
  var curbot = 0;
  this.tick = function() {
    this.robots[curbot].move();
    this.robots[curbot].ping();
    if (++curbot > this.robots.length-1) curbot = 0;
  };
}

module.exports = new Robots();
