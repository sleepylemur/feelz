var db = require('./lib/db.js')();
var models = require('./lib/models.js')(db);

// sync with force=true will drop tables and then rebuild the db from our models
db.sync({force: true}).then(function() {
  Promise.all([
    models.User.create({email: 'e', password: 'e'}),
    models.User.create({email: 'dave@dave.com', password: 'password'}),
    models.Post.create({location: ['40.7127', '-74.0059'], message: 'ugh, i have no thoughts', emotion: 'duh', userId : 1}),
    models.Post.create({location: ['40.7327', '-74.0259'], message: 'do refugees not have place to be?', emotion: 'agro', userId: 2})
  ]).then(function(arr) {
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
