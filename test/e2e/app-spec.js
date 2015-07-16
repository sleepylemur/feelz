/* taken directly from here:
http://thejackalofjavascript.com/end-to-end-testing-with-protractor/ */

'use strict';

var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */
describe('my app', function() {
	it('should kinda work', function() {
		console.log('yay!');
	});
});
	// beforeEach(function () {
	// 	browser.get('index.html');
	// });

	// it('should automatically redirect to / when location hash is empty', function() {
	// 	expect(browser.getLocationAbsUrl()).toMatch("/");
	// });
// });
