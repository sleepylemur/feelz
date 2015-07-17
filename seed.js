var db = require('./lib/db.js')();
var models = require('./lib/models.js')(db);
var faker = require('faker');

// sync with force=true will drop tables and then rebuild the db from our models
db.sync({force: true}).then(function() {

  var fakeUsers = [];

  fakeUsers.push({username: 'e', email: 'e@e.com', password: 'e'})
  fakeUsers.push({username: 'dave', email: 'dave@dave.com', password: 'password'})

  // composes array of fake data objects
  for (var i = 0; i < 100; i++){
    fakeUsers.push({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
  }

  // feeds fake user data into the db
  Promise.all(fakeUsers.map(function(e){
    models.User.create({
      username: e.username,
      email: e.email,
      password: e.password
    })
  })).then(function(){
    // fake posts
    fakePosts = [];

    // randomly create the data
    for (var i = 0; i < 500; i++){
      fakePosts.push({
        userId: Math.floor(Math.random() * 98 + 1),
        location: [
          Math.random() * 0.3 + 40.553,
          Math.random() * 0.15 - 73.999 
        ],
        message: faker.lorem.sentence(),
        emotion: (Math.floor(Math.random() * 2) === 0)? 'rant' : 'rave'
      })
    }

    // and feed into the database
    Promise.all(fakePosts.map(function(e){
      models.Post.create({
        userId: e.userId,
        location: e.location,
        message: e.message,
        emotion: e.emotion
      })
    }))
  }).then(function(arr) {
    // console.dir(arr[0].dataValues);
    console.log('db seeded');
    models.User.findAll().then(function(data) {
      data.forEach(function(row){console.log(row.dataValues);});
      // console.log(data.rows);
      db.close();
    });
    models.Post.findAll().then(function(data){
      data.forEach(function(row){console.log(row.dataValues);});
      db.close();
    });
  });
});
