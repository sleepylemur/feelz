angular.module('login', [])

  .controller('LoginCtrl', function($scope, $http, $window, $location){

    $scope.user = {}
    $scope.submit = function(){
      $http.post('/login', $scope.user)
      .success(function(data, status, header, config){
        $window.sessionStorage.token = data.token;
        $location.path('/map');
      }).error(function(data, status, header, config){
        alert(data.error);
      });
    }
    ////////////////////////////////// FACEBOOK LOGIN STUFFF
  function statusChangeCallback(response) {
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
        // testAPI();
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

    $scope.checkLoginState = function() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
        console.log("function with $scope: " + response);
      });
    }

    $window.fbAsyncInit = function() {
      FB.init({
        appId     : "902314809811684",
        cookie    : true, // enable cookies to allow the server to access
        status    : true,
        xfbml     : true,  // parse social plugins on this page
        version   : 'v2.3' // use version 2.3
      });
      FB.getLoginStatus(function(response){
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

    // function testAPI() {
    //   console.log('Welcome!  Fetching your information.... ');
    //   FB.api('/me', function(response) {
    //     console.log('Successful login for: ' + response.name);
    //     document.getElementById('status').innerHTML =
    //       'Thanks for logging in, ' + response.name + '!';
    //   });
    // }

});
