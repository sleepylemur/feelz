
angular.module('vent', ['ngRoute', 'authinterceptor', 'login', 'signup', 'map', 'newPost', 'post','scratch','main','feedNew','momentfilter','postService'])

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
      .when('/scratch', { // scratch space for running various tests without polluting our pages
        templateUrl: '../template/scratch.html'
      })
      .when('/feedNew', {
        templateUrl: './template/feedNew.html'
      })
      .otherwise({
        redirectTo: '/signup'
      })

  });
