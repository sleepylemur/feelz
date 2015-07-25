
angular.module('feelz', ['ngRoute', 'authinterceptor', 'login', 'signup', 'map','scratch','main','profile','feedNew','feedHot','momentfilter','postService','voteService'])

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
      .when('/feedHot', {
        templateUrl: './template/feedHot.html'
      })
      .when('/profile', {
        templateUrl: './template/profile.html'
      })
      .otherwise({
        redirectTo: '/login'
      })

  });
