var Db = require('./lib/db2.js')();
var db = Db.db;
// var models = require('./lib/models.js')(db);
var faker = require('faker');
var Promise = require('bluebird');

// sync with force=true will drop tables and then rebuild the db from our models
// db.sync({force: true}).then(function() {
Db.reset().then(function() {

  var fakeUsers = [];

  fakeUsers.push({username: 'e', email: 'e@e.com', password: 'e'})
  fakeUsers.push({username: 'dave', email: 'dave@dave.com', password: 'password'})

  // composes array of fake data objects
  for (var i = 0; i < 100; i++){
    fakeUsers.push({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });
  }

  // feeds fake user data into the db
  Promise.map(fakeUsers, function(e){
    return Db.digestPassword(e.password).then(function(password_digest) {
      return db.none("INSERT INTO users (username,email,password) VALUES ($1,$2,$3)",[e.username,e.email,password_digest]);
    });
  }).then(function(){
    console.log('added users');
    // fake posts
    var fakePosts = [];

    // randomly create the data
    for (var i = 0; i < 0; i++){
      fakePosts.push([
        /*user_id*/ Math.floor(Math.random() * 98 + 1),
        /*lat*/ Math.random() * 0.3 + 40.553,
        /*lng*/ Math.random() * 0.15 - 73.999,
        /*message*/ faker.lorem.sentence(),
        /*emotion*/ (Math.floor(Math.random() * 2) === 0)? 'rant' : 'rave'
      ]);
    }
    // and feed into the database
    return Promise.map(fakePosts, function(e){
      return db.none("INSERT INTO posts (user_id,lat,lng,message,emotion) VALUES ($1,$2,$3,$4,$5)",e);
    })
  }).then(function() {
    console.log("added posts");
    return db.many("SELECT * FROM posts");
  }).then(function(rows) {
    console.log(rows);
    process.exit();
  });
});
