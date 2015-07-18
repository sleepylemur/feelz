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
var server,Db,db;

describe('my app', function() {
	before(function() {
		process.env.NODE_ENV = 'testing';
		server = require('../../lib/server.js');
		Db = server.Db;
		db = Db.db;
	});
	after(function() {
		process.env = oldEnv;
	});
	describe('signup', function() {
		beforeEach(function() {
			return Db.reset().then(function() {
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
			element(by.id('confirmpassword')).sendKeys('a');
			element(by.id('signup')).click();
			return browser.wait(protractor.until.elementIsVisible(element(by.id('map-canvas')))).then(function(){
				return expect(db.one("select * from users where email = $1",'a@a.com')).to.eventually.be.ok;
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
	describe('login', function() {
		beforeEach(function() {
			return Db.reset().then(function() {
				server.start();
			});
		});
		afterEach(function() {
			server.stop();
		});

		it('should show the map if valid credentials are supplied', function() {
			return Db.digestPassword('a').then(function(password_digest) {
				return db.none("insert into users (email,password) values ($1,$2)",['a@a.com',password_digest]);
			}).then(function() {
				browser.get('#/login');
				element(by.id('email')).sendKeys('a@a.com');
				element(by.id('password')).sendKeys('a');
				element(by.id('login')).click();
				return expect(browser.wait(protractor.until.elementIsVisible(element(by.id('map-canvas')))))
					.to.eventually.be.ok;
			});
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
