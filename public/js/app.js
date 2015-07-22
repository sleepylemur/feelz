
angular.module('vent', ['ngRoute', 'authinterceptor', 'login', 'signup', 'map','scratch','main','feedNew','momentfilter','postService','voteService'])

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
      .when('/scratch', { // scratch space for running various tests without polluting our pages
        templateUrl: '../template/scratch.html'
      })
      .when('/feedNew', {
        templateUrl: './template/feedNew.html'
      })
      .otherwise({
        redirectTo: '/login'
      })

  });
