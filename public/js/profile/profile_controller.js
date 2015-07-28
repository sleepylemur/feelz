angular.module('profile', [])

.controller('profileCtrl', ['$scope', '$location', '$routeParams','profileService',function($scope, $location, $routeParams, profileService) {

    $scope.msg = 'heya';
    $scope.check = $routeParams.detail;

  profileService.getProfile($routeParams.detail).then(function(data){ 
    $scope.profile = data.data[0];
    $scope.posts = data.data; 
  }); 
  

}])
