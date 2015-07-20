function a() {
  function happy() {
    console.log(5);
  };

  return happy;
}

function sad() {
  console.log(1);
}



var b = a();
var c = a();

console.log(b === c);
console.log(b == c);
console.log(b,c);
