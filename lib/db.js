var Promise = require('bluebird');
// var pg = require('pg');
var pgp = require('pg-promise')({promiseLib: Promise});
var bcrypt = require('bcrypt');

function PandaDb() {

  this.initDb = function initDb() {
    switch(process.env.NODE_ENV) {
      case 'testing':
        this.db = pgp("postgres://localhost/pandatest");
        break;
      case 'development':
        this.db = pgp("postgres://localhost/pandadev");
        break;
      case 'production':
        this.db = pgp(process.env.DATABASE_URL);
        break;
      default:
        throw('NODE_ENV not specified or unknown. should be "testing", "development", or "production"');
    }
  };

  this.initDb();

  this.reset = function reset() {
    return this.db.tx(function() {
      var ctx = this;

      console.log('hi!');
      return Promise.all([
        ctx.none("DROP TABLE IF EXISTS users CASCADE"),
        ctx.none("DROP TABLE IF EXISTS posts CASCADE"),
        ctx.none("DROP TABLE IF EXISTS votes CASCADE")
      ]).then(function() {
        console.log('tables dropped');
        return ctx.none("CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT, email TEXT, password TEXT, facebookid TEXT, avatar_image_url TEXT)");
      }).then(function() {
        console.log('users table created');
        return ctx.none("CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users, timestamp TIMESTAMP, lat DECIMAL, lng DECIMAL, message TEXT, emotion TEXT, post_image_url TEXT)");
      }).then(function() {
        console.log('posts table created');
        return ctx.none("CREATE TABLE votes (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users, post_id INTEGER REFERENCES posts, timestamp TIMESTAMP)");
      }).then(function() {
        console.log('votes table created');
      })
    });
  };

  this.digestPassword = function digestPassword(p) {
    return Promise.fromNode(function(callback) {
      bcrypt.hash(p,10,callback);
    });
  };
  this.comparePassword = function comparePassword(hash,test) {
    return Promise.fromNode(function(callback) {
      bcrypt.compare(test,hash,callback);
    });
  };
}

module.exports = function() {return new PandaDb();};
