angular.module('main',['postService', 'mapinitializer'])
  .controller('mainCtrl', ['$rootScope','voteService','postService','mapinitializer','$scope','$location','$window','$http',function($rootScope, voteService, postService, mapinitializer, $scope, $location, $window, $http){

    $rootScope.$location = $location;
    mapinitializer.mapInit();

    // listens to new post arriving by socket
    $scope.$on('newpost', function(event, post) {
      $scope.$apply(function() {
        if (post.emotion === "rant") {
          mapinitializer.rantHeat.data.push(new google.maps.LatLng(post.lat, post.lng));
        } else {
          mapinitializer.raveHeat.data.push(new google.maps.LatLng(post.lat, post.lng));
        }
      });
    });

    $scope.signOut = function(){
      postService.clear();
      voteService.clear();
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.user_id;
      $location.path('/');
    }
  }])
