angular.module('newPost',[])
  .controller('newPostCtrl', function($http, $location, $scope, $window){
      $scope.post = function(){
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position.coords.latitude, position.coords.longitude);
        });
      }
  });
