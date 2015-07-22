angular.module('main',['postService', 'mapinitializer'])
  .controller('mainCtrl', function(postService, mapinitializer, $scope, $location, $window, $http){
    $scope.signOut = function(){
      postService.clear();
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.user_id;
      $location.path('/');
    }
  })
