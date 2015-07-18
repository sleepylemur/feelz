var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var assert = chai.assert;
var request = require('supertest');

var server = require('../lib/server.js');
var models = require('../lib/models.js')(server.db);

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
      return server.db.sync({force: true}).then(function() {
        return Promise.all([
          models.User.create({email: 'sam@sam.com', password: 'password'}),
          models.User.create({email: 'dave@dave.com', password: 'password'})
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
