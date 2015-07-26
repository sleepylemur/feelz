var faker = require('faker');
var Promise = require('bluebird');
var request = require('superagent');

var robotlocations = ["in between the grid","lost","rebound line","flat by the iron", "cooler corner", "tropical dessert"];
var robotrants =
  ["Programmable logic controller acceleration engine hydraulic degrees of freedom energy source.",
    "Network limiting device intelligence operator singularity axle optimization realtime titanium.",
    "system program register industrial wheel three laws of robotics ball joint interlock no disassemble",
    "Serve and protect power system wheel watts jerk exponential assembly program metal drive",
    "T-850 yaw trigger point DARPA jerk system laser light emitting diode.",
    "Collision sensor sensor scale arm end-effector dexterity wood Brackenridge.",
    "Aware joint motion machine identify yourself laser beams cam.",
    "System serve and protect exponential assembly device acceleration wheel laser beams "];
var robotimages = [1,2,3,4,5,6,7,8,9,10].map(function(e){return "/images/dustbot"+e+".jpg";});
var serverurl;
if (process.env.NODE_ENV === 'production') serverurl = 'https://pandastaging.herokuapp.com';
else serverurl = 'http://localhost:3000';

// var ioClient = require('socket.io-client');


function Robot() {
  this.origlat = 40.7127074 + Math.random()*0.1;
  this.origlng = -74.0059593 + Math.random()*0.1;
  this.happiness = Math.random();
  this.lat = this.origlat;
  this.lng = this.origlng;
  this.speed = 0.003;
  this.turnspeed = 1;
  this.homingspeed = 0.6;
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
      var location_name = robotlocations[Math.floor(Math.random()*robotlocations.length)];
      var image_url;
      if (Math.random() < 0.4) image_url = null;
      else image_url = robotimages[Math.floor(Math.random()*robotimages.length)];
      var emo = Math.random() > this.happiness ? 'rant' : 'rave';
      // this.socket.emit('new post', { rant: rant });
      request
        .post(serverurl+'/api/posts')
        .set({Authorization: "Bearer "+this.token})
        .send({
          emotion: emo,
          message: rant,
          lat: this.lat,
          lng: this.lng,
          location_name: location_name,
          image_url: image_url
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

  this.start = function(speed) {
    if(this.timer) clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), speed || 500);
  };
  var curbot = 0;
  this.tick = function() {
    this.robots[curbot].move();
    this.robots[curbot].ping();
    if (++curbot > this.robots.length-1) curbot = 0;
  };
}

module.exports = new Robots();
