angular.module('newPost',[])
  .controller('newPostCtrl', function($http, $location, $scope, $window){
      $scope.post = {};
      $scope.submit = function(){
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.post.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          console.log("before http post: "+ $scope.post);
          $http.post('/newPost', $scope.post).success(function(data, status, header, config){
            console.log(data);
          }).error(function(data, status, header, config){
            console.log(data);
          });
        });
      }
  });
