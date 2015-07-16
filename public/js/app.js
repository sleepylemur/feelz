angular.module('vent', ['ngRoute', 'authinterceptor', 'login', 'signup', 'map', 'newPost', 'post'])
  .controller('mainCtrl', function($rootScope, $scope, $location, $window){
    $scope.testsocket = function() {
      // var socket = io()
      // socket.emit('post','hello server');
    }
    $scope.signOut = function(){
      delete $window.sessionStorage.token;
      $location.path('/');
      $rootScope.socket.emit('removeUser', $rootScope.currentuser);
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
      .when('/newPost', {
        templateUrl: '../template/new_post.html'
      })
      .when('/post', {
        templateUrl: '../template/post.html'
      })
      .otherwise({
        redirectTo: '/signup'
      })

  });
