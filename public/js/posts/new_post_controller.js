angular.module('newPost',[])
  .controller('newPostCtrl', function($http, $location, $rootScope, $scope, $window){
      $scope.post = {};
      $scope.submit = function(){
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.post.lat = position.coords.latitude;
          $scope.post.lng = position.coords.longitude;

          $http.post('/api/posts', $scope.post).success(function(data, status, header, config){
            //tell socket new post has been made
            // $rootScope.socket.emit('new post', data);
            $location.path('/map');
          }).error(function(data, status, header, config){
            console.log("post failed!!!"  + data);
          });
        });
      };
  });
