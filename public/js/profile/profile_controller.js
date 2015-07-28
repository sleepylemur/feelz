angular.module('profile', [])

.controller('profileCtrl', ['$scope', '$location', '$routeParams','profileService',function($scope, $location, $routeParams, profileService) {

  $scope.msg = 'heya';
  $scope.check = $routeParams.user_id;

  profileService.getProfile($routeParams.user_id).then(function(data){ 
    $scope.profile = data.data[0];
    $scope.posts = data.data; 
  });


}])
