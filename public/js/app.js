angular.module('vent', ['ngRoute', 'authinterceptor', 'login', 'signup', 'map'])
  .controller('mainCtrl', function($scope, $location, $window){
    $scope.signOut = function(){
      delete $window.sessionStorage.token;
      $location.path('/');
    }
  })
  .controller('testcontroller', function($scope) {
    $scope.message = 'hi!';
  })
  .controller('homeCtrl', function($scope, $http){
    $http.get('/api/secret').success(function(data) {
      console.log(data);
    });
  })

 .config(function($routeProvider, $httpProvider) {
   $httpProvider.interceptors.push('authInterceptor');
    $routeProvider
      .when('/login', {
        templateUrl: '../template/login.html'
      })
      .when('/signup', {
        templateUrl: '../template/signup.html'
      })
      .when('/map', {
        templateUrl: '../template/map_view.html'
      })

      // .when('/feed', {
      //
      // })
  });
