angular.module('profile', [])
.controller('profileCtrl', ['$scope', 'profileService',function($scope) {
    $scope.msg = 'heya';

    console.log('detail:',$routeParams.detail);
    profileService.getUser(parseInt($routeParams.detail)).then(function(data) {
      console.log('profile returns',data);
      $scope.user = data;
    });
    console.log('profilectrl ',$scope.user);
}])
