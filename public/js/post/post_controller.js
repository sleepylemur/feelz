angular.module('post', [])
.controller('postCtrl', function($scope, $location, $routeParams, postService){
  postService.getPost(parseInt($routeParams.detail)).then(function(data) {
    $scope.post = data;
  });
  console.log('postctrl ',$scope.post);
})