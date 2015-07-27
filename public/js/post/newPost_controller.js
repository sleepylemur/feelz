angular.module('newPost', [])
.controller('newPostCtrl', function($scope, $http, $location, $routeParams, postService){

  console.log("newPostCtrl connected");
    $scope.post = {};
    // open modal to write new post
    $scope.newPost = function() {
      $('#modalNewPost').openModal();
    };
    // submit our post to the server
    $scope.submitNewPost = function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.post.lat = position.coords.latitude;
        $scope.post.lng = position.coords.longitude;
        $scope.post.emotion = $scope.post.rantrave ? 'rave' : 'rant';

        $http.post('/api/posts', $scope.post).success(function(data, status, header, config){
          $('#modalNewPost').closeModal();
          handleResize();
          // clear out modal for next use
          $scope.post = {};
          $('#imagepreview').attr('src','images/placeholder.png');
        }).error(function(data, status, header, config){
          alert("post failed!!!"  + data.error);
        });
      });
    };
    // trigger the browse file dialog
    $scope.fileDialog = function() {
      $('#filepicker').click();
    };
    // browse file dialog closed so upload our file and replace placeholder with the returned url
    $scope.uploadFile = function() {
      var file = $('#filepicker')[0].files[0];
      var fd = new FormData(); // FormData requires >= ie10
      if (file.type.match('image.*')) {
        fd.append('image', file, file.name);

        $http.post('/imageUpload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined} // undefined causes the browser to fill in the needed details
        })
        .success(function(url){
          console.log('uploaded',url);
          $scope.post.image_url = url;
          // $('#imagepreview').attr('src',url);
        })
        .error(function(e){
          alert('error '+e);
        });
      } else {
        alert('not an image file');
      }
    };
})