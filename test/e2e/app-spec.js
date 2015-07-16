/* taken directly from here:
http://thejackalofjavascript.com/end-to-end-testing-with-protractor/ */

'use strict';

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

var oldEnv = process.env.NODE_ENV;
var server,models,db;

describe('my app', function() {
	before(function() {
		process.env.NODE_ENV = 'testing';
		server = require('../../lib/server.js');
		models = server.models;
		db = server.db;
	});
	after(function() {
		process.env = oldEnv;
	});
	describe('signup', function() {
		beforeEach(function() {
			return db.sync({force: true}).then(function() {
				return models.User.create({email:'b',password:'b'});
			}).then(function() {
				server.start();
			});

		});
		afterEach(function() {
			server.stop();
		});
		it('should add a user to the db when we signup', function() {
			browser.get('#/signup');
			element(by.id('username')).sendKeys('a');
			element(by.id('email')).sendKeys('a');
			element(by.id('password')).sendKeys('a');
			element(by.id('signup')).click();
			return browser.getCurrentUrl().then(function(url) {
				return expect(models.User.find({where:{email:'a'}})).to.eventually.be.ok;
			});

			// test that we added a user
		});
	});
});
	// beforeEach(function () {
	// 	browser.get('index.html');
	// });

	// it('should automatically redirect to / when location hash is empty', function() {
	// 	expect(browser.getLocationAbsUrl()).toMatch("/");
	// });
// });
