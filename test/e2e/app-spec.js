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
				server.start();
			});

		});
		afterEach(function() {
			server.stop();
		});
		it('should add a user to the db and navigate to map page when we signup', function() {
			browser.get('#/signup');
			element(by.id('username')).sendKeys('a');
			element(by.id('email')).sendKeys('a@a.com');
			element(by.id('password')).sendKeys('a');
			element(by.id('signup')).click();
			return browser.wait(protractor.until.elementIsVisible(element(by.id('map-canvas')))).then(function(){
				return expect(models.User.find({where:{email:'a@a.com'}})).to.eventually.be.ok;
			});
		});
		// it('should show a validation error if the same email signs up twice', function(done) {
		// 	models.User.create({email: 'a@a.com', password: 'a', username: 'a'});
		// 	browser.get('#/signup');
		// 	element(by.id('username')).sendKeys('a');
		// 	element(by.id('email')).sendKeys('a@a.com');
		// 	element(by.id('password')).sendKeys('a');
		// 	element(by.id('signup')).click();
		// 	expect(element
		// });
	});
});
	// beforeEach(function () {
	// 	browser.get('index.html');
	// });

	// it('should automatically redirect to / when location hash is empty', function() {
	// 	expect(browser.getLocationAbsUrl()).toMatch("/");
	// });
// });
