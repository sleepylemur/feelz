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

angular.module('authinterceptor', [])
  .factory('authInterceptor', function($q, $window, $location) {
   return {
     request: function(config) {
       config.headers = config.headers || {};
       if ($window.sessionStorage.token) {
         config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
       }
       return config;
     },
     response: function(response) {
       if (response.status === 401) {
         delete $window.sessionStorage.token;
         $location.path('login');
       }
       return response || $q.when(response);
     }
   };
 })
angular.module('signup', [])
  .controller('SignUpCtrl', function($scope, $http, $location, $window){
    $scope.user = {}
    $scope.signUp = function(){
      $http.post('/signup', $scope.user)
        .success(function(data, status, header, config){
          $window.sessionStorage.token = data.token;
          $location.path('/home');
        }).error(function(data, status, header, config){
          alert(status);
        });
      }
    })