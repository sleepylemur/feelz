angular.module('signup', [])
  .controller('SignUpCtrl', function($scope, $http, $location, $window){
    $scope.user = {}
    $scope.signUp = function(){
      $http.post('/signup', $scope.user)
        .success(function(data, status, header, config){
          $window.sessionStorage.token = data.token;
          $location.path('/map');
        }).error(function(data, status, header, config){
          alert(data.error);
        });
      }
    })
