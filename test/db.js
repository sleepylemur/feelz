var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var Db = require('../lib/db.js')();

describe('db.js', function() {
  var oldtarget;
  describe('with NODE_ENV "testing"', function() {
    // set env specifically for this test
    before(function() {
      oldtarget = process.env.NODE_ENV;
      process.env.NODE_ENV = 'testing';
    });
    after(function() {
       process.env.NODE_ENV = oldtarget;
    });
    it('should have a db.one method when NODE_ENV is "testing"', function() {
      Db.initDb();
      expect(Db.db.one).to.be.a('function');
    });
  });
  describe('with NODE_ENV "development"', function() {
    // set env specifically for this test
    before(function() {
      oldtarget = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
    });
    after(function() {
       process.env.NODE_ENV = oldtarget;
    });
    it('should have a db.one method when NODE_ENV is "development"', function(){
      Db.initDb();
      expect(Db.db.one).to.be.a('function');
    });
  });
});
