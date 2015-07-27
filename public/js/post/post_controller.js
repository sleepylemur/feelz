angular.module('post', [])
.controller('postCtrl', ['$scope', '$location', '$routeParams', 'postService', function($scope, $location, $routeParams, postService){
  console.log('detail:',$routeParams.detail);
  postService.getPost(parseInt($routeParams.detail)).then(function(data) {
    console.log('post returns',data);
    $scope.post = data;
  });
  console.log('postctrl ',$scope.post);
}])
