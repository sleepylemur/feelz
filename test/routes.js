var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var assert = chai.assert;
var request = require('supertest');

var server = require('../lib/server.js');
var Db = server.Db;

describe('routes.js', function() {
  describe('GET /', function() {
    it('should return status 200 and be text/html', function(done) {
      request(server.app)
        .get('/')
        .accept('text/html')
        .expect('Content-Type',/text\/html/)
        .expect(200, done);
    });
  });

  describe('routes involving db', function() {
    beforeEach(function() {
      // drop tables and reseed db
      return Db.reset().then(function() {
        return Promise.all([
          Db.db.none("insert into users (email,password) values ($1,$2)",['sam@sam.com','password']),
          Db.db.none("insert into users (email,password) values ($1,$2)",['dave@dave.com','password'])
        ]);
      });
    });
    describe('GET /users', function() {
      it('should return a list of the users that we added', function(done) {
        request(server.app)
          .get('/users')
          .accept('json')
          .end(function(err,res) {
            if (err) throw(err);
            var arr = res.body;
            expect(arr).to.have.length(2);
            expect(arr[0].email).to.equal('sam@sam.com');
            expect(arr[1].email).to.equal('dave@dave.com');
            done();
          });
      });
    });
  });
});
