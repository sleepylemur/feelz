angular.module('scratch',[])
  .controller('scratchCtrl', ['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    console.log($routeParams);
    $scope.testupload = function() {
      var file = document.getElementById('file').files[0];
      var fd = new FormData(); // FormData requires >= ie10
      if (file.type.match('image.*')) {
        fd.append('image', file, file.name);

        $http.post('/imageUpload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined} // undefined causes the browser to fill in the needed details
        })
        .success(function(d){
          console.log('uploaded',d);
          alert('uploaded');
        })
        .error(function(e){
          alert('error '+e);
        });
      } else {
        alert('not an image file');
      }
    }
  }]);
