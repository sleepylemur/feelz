angular.module('landing', [])

  .controller('LandingCtrl', ['cloudAnimation','$scope','$http','$window','$location', function(cloudAnimation, $scope, $http, $window, $location){

    // google analytics
    ga('send', 'pageview', '/#/login');
    console.log('landing!');
    cloudAnimation.runClouds();


    // disabled facebook login

    // // Load the SDK asynchronously
    // (function(d, s, id) {
    //   var js, fjs = d.getElementsByTagName(s)[0];
    //   if (d.getElementById(id)) return;
    //   js = d.createElement(s); js.id = id;
    //   js.src = "//connect.facebook.net/en_US/sdk.js";
    //   fjs.parentNode.insertBefore(js, fjs);
    // }(document, 'script', 'facebook-jssdk'));

    // function testAPI() {
    //   console.log('Welcome!  Fetching your information.... ');
    //   FB.api('/me', function(response) {
    //     console.log('Successful login for: ' + response.name);
    //     document.getElementById('status').innerHTML =
    //       'Thanks for logging in, ' + response.name + '!';
    //   });
    // }

}]);
