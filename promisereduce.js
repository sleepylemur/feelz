var Promise = require('bluebird');

function f(x) {
  return new Promise(function(resolve,reject) {
    setTimeout(function() {resolve(x*2);},500);
  });
}

var a = [1,2,3,4,5,6];


var b = Promise.map(a, function(e){console.log(e);return f(e);}, {concurrency: 2});

b.then(console.log);
