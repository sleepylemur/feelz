var A = function(){
  this[0]=5;
  this[1]=3;
  this[2]=15;
  this[4]=8;
  this.length = 3;
};
A.prototype = Object.create(Array.prototype);
A.prototype.forEach = function() {console.log(3);};

b = [1,2,3];
b.forEach(console.log);

a = new A();
a.forEach(console.log);
