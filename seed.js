var db = require('./lib/db.js')();
var models = require('./lib/models.js')(db);

db.sync({force: true}).then(function() {
  Promise.all([
    models.User.create({email: 'e', password: 'e'}),
    models.User.create({email: 'dave@dave.com', password: 'password'})
  ]).then(function() {
    console.log('db seeded');
    models.User.findAll().then(function(data) {
      data.forEach(function(row){console.log(row.dataValues);});
      // console.log(data.rows);
      db.close();
    });
  });
});
