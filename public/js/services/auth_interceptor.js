angular.module('authinterceptor', [])
  .factory('authInterceptor', ['$q', '$window', '$location', function($q, $window, $location) {
   return {
     request: function(config) {
       config.headers = config.headers || {};
       if ($window.sessionStorage.token) {
         config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;

         // if no token, redirect to login, unless path === signup page.
       } else if ($location.$$path !== '/signup'){
        $location.path('login')
       }
       return config;
     },
     responseError: function(response) {
      console.log(response)
       if (response.status === 401) {
         delete $window.sessionStorage.token;
         $location.path('login');
       }
       return response || $q.when(response);
     }
   };
 }])
