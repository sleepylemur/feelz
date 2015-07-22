angular.module('main',['postService'])
  .controller('mainCtrl', function(voteService, postService, $scope, $location, $window, $http){
    $scope.$location = $location;
    $scope.signOut = function(){
      postService.clear();
      voteService.clear();
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.user_id;
      $location.path('/');
    }
  })
