angular.module('profile', [])

.controller('profileCtrl', ['$scope', '$location', '$routeParams','profileService',function($scope, $location, $routeParams, profileService) {

    $scope.msg = 'heya';
    $scope.check = $routeParams.detail;
  // check to see if an user id is passed 
  if($routeParams.detail){
    profileService.getOtherProfile(parseInt($routeParams.detail)).then(function(data) {
      console.log('profile returns',data);
      $scope.profile = data;
    });
  }else{
    // if not then the profile route should render current user profile 
    profileService.getProfile().then(function(data){ 
      console.log("return profile data "+ data);
      $scope.profile = data.user;
      $scope.posts = data.posts; 
    }); 
  }



  
}])
