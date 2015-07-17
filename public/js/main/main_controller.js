angular.module('main',[])
  .controller('mainCtrl', function($rootScope, $scope, $location, $window, $http){
    $scope.signOut = function(){
      delete $window.sessionStorage.token;
      $location.path('/');
      $rootScope.socket.emit('removeUser', $rootScope.currentuser);
    }
  })
