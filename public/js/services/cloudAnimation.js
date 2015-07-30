angular.module('cloudAnimation', [])
  .factory('cloudAnimation', function(){


      function triangleArea(t) {
        var ax = t[1][0] - t[0][0];
        var ay = t[1][1] - t[0][1];
        var bx = t[2][0] - t[0][0];
        var by = t[2][1] - t[0][1];
        return Math.abs(ax*by - ay*bx)/2;
      }
      function pointInsideTriangle(t) {
        var ax = t[1][0] - t[0][0];
        var ay = t[1][1] - t[0][1];
        var bx = t[2][0] - t[0][0];
        var by = t[2][1] - t[0][1];
        var a = Math.random();
        var b = Math.random();
        if (a+b > 1) {a = 1-a; b = 1-b;}
        return [t[0][0] + a*ax + b*bx, t[0][1] + a*ay + b*by];
      }
      function weightedRandom(weights) {
        var total = weights.reduce(function(sum,cur){return sum+cur;},0);
        var r = Math.random()*total;
        console.log(total,weights,r);
        for (var i=0; i<weights.length; i++) {
          if (r<=weights[i]) return i;
          r -= weights[i];
        }
        return weights.length-1;
      }

    // rough triangulated boundary of manhattan
      var triangles = [
        [[72,349],[119,241],[173,346]],
        [[211,247],[119,241],[173,346]],
        [[211,247],[119,241],[336,70]],
        [[336,70],[211,247],[344,142]]
      ];
      var areas = triangles.map(function(t){return triangleArea(t);});

      var curcloud = 0;
      var clouds = document.getElementsByClassName('cloud');
      var tears = document.getElementsByClassName('tear');
      var puddles = document.getElementsByClassName('puddle');

      var interval = setInterval(function() {
        var target = pointInsideTriangle(triangles[weightedRandom(areas)]);
        clouds[curcloud].style.top = target[1] - 120 - 75 + "px";
        clouds[curcloud].style.left = target[0] - 218 - 50 + "px";
        tears[curcloud].style.top = target[1] - 70 + "px";
        tears[curcloud].style.left = target[0] - 218 - 75 + "px";
        puddles[curcloud].style.top = target[1] - 10 + "px";
        puddles[curcloud].style.left = target[0] - 218 - 15 + "px";
        var speed = Math.floor(Math.random()*50)/10+20;
        tears[curcloud].style.animation = 'cry '+speed+'s linear infinite';
        puddles[curcloud].style.animation = 'pool '+speed+'s linear infinite';
        if (Math.random() > 0.5) { // choose left or right side
          clouds[curcloud].style.animation = 'floatright '+speed+'s linear infinite';
          puddles[curcloud].style.background = "#3f51b5";
        } else {
          clouds[curcloud].style.animation = 'floatleft '+speed+'s linear infinite';
          puddles[curcloud].style.background = "#ffd54f";
          clouds[curcloud].className = clouds[curcloud].className + " mirror";
        }
        curcloud++;
        if (curcloud >= clouds.length) {
          curcloud = 0;
          clearInterval(interval);
        }
      },700);

  return interval; 

})