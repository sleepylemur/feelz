var Db = require('./lib/db.js')();
var db = Db.db;
var faker = require('faker');
var Promise = require('bluebird');

// sync with force=true will drop tables and then rebuild the db from our models
// db.sync({force: true}).then(function() {
Db.reset().then(function() {

  var fakeUsers = [];

  fakeUsers.push({username: 'e', email: 'e@e.com', password: 'e', avatar_image_url: '/images/avatars/blavatars-06.png'})

  // composes array of fake data objects
  for (var i = 0; i < 0; i++){
    fakeUsers.push({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });
  }

  // feeds fake user data into the db
  Promise.map(fakeUsers, function(e){
    return Db.digestPassword(e.password).then(function(password_digest) {
      return db.none("INSERT INTO users (username,email,password,avatar_image_url) VALUES ($1,$2,$3,$4)",[e.username,e.email,password_digest,e.avatar_image_url]);
    });
  }).then(function(){
    console.log('added users');
    // fake posts
  //   var fakePosts = [];
  //
  //   // randomly create the data
  //   for (var i = 0; i < 0; i++){
  //     fakePosts.push([
  //       /*user_id*/ Math.floor(Math.random() * 98 + 1),
  //       /*lat*/ Math.random() * 0.3 + 40.553,
  //       /*lng*/ Math.random() * 0.15 - 73.999,
  //       /*message*/ faker.lorem.sentence(),
  //       /*emotion*/ (Math.floor(Math.random() * 2) === 0)? 'rant' : 'rave',
  //       /*timestamp*/ new Date(new Date() - Math.floor(Math.random() * 1000*60*60*6))
  //     ]);
  //   }
  //   // and feed into the database
  //   return Promise.map(fakePosts, function(e){
  //     return db.none("INSERT INTO posts (user_id,lat,lng,message,emotion,timestamp) VALUES ($1,$2,$3,$4,$5,$6)",e);
  //   })
  // }).then(function() {
  //   console.log("added posts");
  //   return db.many("SELECT * FROM posts");
  // }).then(function(rows) {
  //   console.log(rows);
    process.exit();
  });
});
