angular.module('vent', ['ngRoute', 'authinterceptor', 'login', 'signup'])
  .controller('testcontroller', function($scope) {
    $scope.message = 'hi!';
  })
  .controller('homeCtrl', function($scope, $http){
    $http.get('/api/secret').success(function(data) {
      console.log(data);
    });
  })
  .controller('fbCtrl', function($scope) {
    alert('hi fb!');
  })
  .controller('fb2Ctrl', function($scope) {
    alert('hi fb2!');
  })
 .config(function($routeProvider, $httpProvider) {
   $httpProvider.interceptors.push('authInterceptor');
    $routeProvider
      .when('/login', {
        templateUrl: '../template/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: '../template/signup.html',
        controller: 'SignUpCtrl'
      })
      .when('/map', {
        templateUrl: '../template/home.html'
      })
      // .when('/feed', {
      //
      // })
      // .when('/fb', {
      //   templateUrl: '../template/fb.html',
      //   controller: 'fbCtrl'
      // })
      .when('/fb', {
        templateUrl: '../template/fb.html',
        controller: 'fbCtrl'
      });
  });
