angular.module('landing', [])

  .controller('LandingCtrl', ['cloudAnimation','$scope','$http','$window','$location', function(cloudAnimation, $scope, $http, $window, $location){

    // google analytics
    ga('send', 'pageview', '/#/login');
    console.log('landing!');
    cloudAnimation.runClouds();

}]);
