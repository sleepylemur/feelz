angular.module('signup',[])
  .controller('SignUpCtrl', function($rootScope, $scope, $http, $location, $window){
    $scope.user = {}
    $scope.usernameerror = "bad name";
    $scope.validateUsername = function() {
      delete $scope.usernameerror;
    };
    $scope.signUp = function(){
      $http.post('/signup', $scope.user)
        .success(function(data, status, header, config){
          $window.sessionStorage.token = data.token;
          /// initial client socket
          $rootScope.currentuser = {id: data.id};
          $rootScope.socket = io();
          /// add user to socket with session token
          $rootScope.socket.emit('addUser', $rootScope.currentuser);
          $location.path('/map');
        }).error(function(data, status, header, config){
          alert(data.error);
        });
      }
    })
