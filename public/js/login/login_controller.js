angular.module('login', [])
  .controller('LoginCtrl', function($scope, $http, $window, $location){
    $scope.user = {}
    $scope.submit = function(){
      $http.post('/login', $scope.user)
      .success(function(data, status, header, config){
        $window.sessionStorage.token = data.token;
        $location.path('/home');
      }).error(function(data, status, header, config){
        alert(data.error);
      });
    }
    $scope.fbSignIn = function(){

    }
  })
