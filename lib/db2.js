var Promise = require('bluebird');
// var pg = require('pg');
var pgp = require('pg-promise')({promiseLib: Promise});

function initDb() {
  switch(process.env.NODE_ENV) {
    case 'testing':
      return pgp("postgres://localhost/pandadev");
    case 'development':
      return pgp("postgres://localhost/pandadev");
    case 'production':
      return pgp(process.env.DATABASE_URL);
    default:
      throw('NODE_ENV not specified or unknown. should be "testing", "development", or "production"');
  }
}

var db = initDb();
function migrate(db) {
  db.tx(function() {
    var users = this.none("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT, facebookid TEXT, avatar_image_url TEXT)");
    var posts = this.none("CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users, timestamp TIMESTAMP, lat DECIMAL, lng DECIMAL, message TEXT, emotion TEXT, post_image_url TEXT)");
    var votes = this.none("CREATE TABLE votes (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users, post_id INTEGER REFERENCES posts, timestamp TIMESTAMP)");

    return Promise.all([
      this.none("DROP TABLE IF EXISTS users CASCADE"),
      this.none("DROP TABLE IF EXISTS posts CASCADE"),
      this.none("DROP TABLE IF EXISTS votes CASCADE")
    ]).then(function() {
      console.log('tables dropped');
      return users; // run create users query
    }).then(function() {
      console.log('users table created');
      return posts; // run create posts query
    }).then(function() {
      console.log('posts table created');
      return votes; // run create votes query
    }).then(function() {
      console.log('votes table created');
      process.exit();
    });
  });
}
