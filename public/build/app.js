angular.module('vent', ['ngRoute', 'authinterceptor', 'login', 'signup', 'map'])
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
      .when('/feed', {

      })
  });

angular.module('login', [])
  .controller('LoginCtrl', function($scope, $http, $window){
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


    ////////////////////////////////// FACEBOOK LOGIN STUFFF

    // This is called with the results from from FB.getLoginStatus().
     function statusChangeCallback(response) {
      console.log('statusChangeCallback');
      console.log(response);

      if (response.status === 'connected') {
        var fbAccount = {
          fbID: response.authResponse.userID,
          token: response.authResponse.accessToken
        }
        $http.post('/fbsignin', fbAccount)
        .success(function(data, status, header, config){
            console.log(data);
        }).error(function(data, status, header, config){
          console.log(data.error);
        });
        // Logged into your app and Facebook.
        testAPI();
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into Facebook.';
      }
    }

    function checkLoginState() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }

    $window.fbAsyncInit = function() {
      FB.init({
        appId      : "902314809811684",
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.3' // use version 2.3
      });

      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
      });
    }
  })

angular.module('map', [])
  .controller('MapCtrl', function($scope){
    var options = {
      center: {lat: 40.7397645, lng: -73.9894801},
      zoom: 10,
      styles: mapStyle
    }

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), options);

    return $scope;
  })
var mapStyle = [{"featureType":"all","elementType":"all","stylers":[{"saturation":-100},{"gamma":0.5}]},{"featureType":"administrative.land_parcel","elementType":"geometry","stylers":[{"invert_lightness":true}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#7a945e"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"saturation":"100"},{"lightness":"0"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"saturation":"100"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"saturation":"100"},{"hue":"#ff0000"},{"lightness":"-9"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"lightness":"0"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"lightness":"-34"},{"saturation":"0"},{"gamma":"3.05"},{"weight":"2.06"},{"invert_lightness":true},{"hue":"#ff0000"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"saturation":"100"},{"visibility":"on"},{"hue":"#ff0000"},{"lightness":"-8"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"saturation":"0"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"lightness":"0"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"saturation":"100"}]},{"featureType":"transit.line","elementType":"geometry.stroke","stylers":[{"saturation":"100"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"saturation":"100"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"lightness":"-55"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"invert_lightness":true}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"weight":"1.75"},{"color":"#000000"}]}]
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