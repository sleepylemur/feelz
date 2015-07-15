var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var dbFactory = require('../lib/db.js');

describe('db.js', function() {
  var db;
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
    it('should initialize a sequelize object for testing when NODE_ENV is "testing"', function() {
      db = dbFactory();
      return expect(db.authenticate()).to.eventually.be.undefined;
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
    it('should initialize a sequelize object for testing when NODE_ENV is "development"', function(){
      db = dbFactory();
      return expect(db.authenticate()).to.eventually.be.undefined;
    });
  });
});
