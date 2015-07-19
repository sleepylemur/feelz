var A = {
  a:1,
  b:2,
  props: function() {
    for (var p in this) {
      console.log(p, this[p], typeof this[p]);
    }
  }
};

var B = {
  c:3,
  d:4
};
B.__proto__ = A;

var C = {
  e:5,
  f:6
};
C.__proto__ = B;

C.props();
