angular.module('profile', [])

.controller('profileCtrl', ['$scope', '$location', '$routeParams','profileService',function($scope, $location, $routeParams, profileService) {

  $scope.check = $routeParams.user_id;

  profileService.getProfile($routeParams.user_id).then(function(data){
    $scope.profile = data.data[0];
    $scope.posts = data.data;
  });

  $scope.editProfile = function(){
    $('#editProfileModal').openModal();
  };

  $scope.loadDetail = function(id) {
    $location.path('/post/' + id);
  };

  $scope.goToMap = function(id) {
    $location.path('/map').search({detail: id});
  };
}]);
