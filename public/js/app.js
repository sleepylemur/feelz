

angular.module('feelz', ['ngRoute', 'authinterceptor', 'login', 'signup', 'map','scratch','main','profile','profileService','feedNew','feedHot','post','momentfilter','postService','voteService', 'about'])

 .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
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
      .when('/post/:post_id', {
        templateUrl: './template/post.html'
      })
      .when('/profile/:user_id', {
        templateUrl: './template/profile.html'
      })
      .when('/profile', {
        templateUrl: './template/profile.html'
      })
      .when('/about', {
        templateUrl: './template/about.html'
      })
      .otherwise({
        redirectTo: '/login'
      })

  }]);
