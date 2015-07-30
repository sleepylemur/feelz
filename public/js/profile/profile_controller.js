angular.module('profile', [])

.controller('profileCtrl', ['$window', '$http', '$scope', '$location', '$routeParams','profileService',function($window, $http, $scope, $location, $routeParams, profileService) {

  $scope.editMode = false;
  $scope.check = $routeParams.user_id;

  profileService.getProfile($routeParams.user_id).then(function(data){
    $scope.profile = data.data[0];
    $scope.profileEdit = JSON.parse(JSON.stringify($scope.profile));
    $scope.posts = data.data;
  });

  $scope.cancelEdit = function() {
    // reset form data
    $scope.editMode = false;
    $scope.profileEdit = JSON.parse(JSON.stringify($scope.profile));
  };
  $scope.submitEdit = function() {
    $scope.profile = JSON.parse(JSON.stringify($scope.profileEdit));
    $http.put('/api/users/'+$window.sessionStorage.user_id, $scope.profileEdit).success(function(data) {
      $scope.editMode = false;
    }).error(function(err) {
      alert('error saving changes: '+err);
    });
  };

  $scope.loadDetail = function(id) {
    $location.path('/post/' + id);
  };

  $scope.goToMap = function(id) {
    $location.path('/map').search({detail: id});
  };

  // trigger the browse file dialog
  $scope.fileDialog = function() {
    $('#avatarfilepicker').click();
  };
  // browse file dialog closed so upload our file and replace placeholder with the returned url
  $scope.uploadFile = function() {
    var file = $('#avatarfilepicker')[0].files[0];
    var fd = new FormData(); // FormData requires >= ie10
    if (file.type.match('image.*')) {
      fd.append('image', file, file.name);

      $http.post('/imageUpload', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined} // undefined causes the browser to fill in the needed details
      })
      .success(function(url){
        console.log('uploaded',url);
        $scope.profileEdit.avatar_image_url = url;
        // $('#imagepreview').attr('src',url);
      })
      .error(function(e){
        alert('error '+e);
      });
    } else {
      alert('not an image file');
    }
  };
}]);
