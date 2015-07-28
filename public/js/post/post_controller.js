angular.module('post', [])
.controller('postCtrl', ['$scope', '$location', '$routeParams', 'postService', 'voteService', function($scope, $location, $routeParams, postService, voteService){
  console.log('detail:',$routeParams.detail);

  voteService.getVotes().then(function(data) {
    $scope.votes = data;
  });
  $scope.voteService = voteService;

  postService.getPost(parseInt($routeParams.detail)).then(function(data) {
    console.log('post returns',data);
    $scope.post = data;
  });
  console.log('postctrl ',$scope.post);

  $scope.fetchProfile = function(user_id) {
      $location.path('/profile').search({detail: user_id});
  };
  $scope.$on('updatevote', function(event,data) {
    console.log('update: ',data);
  });

  $scope.goToMap = function(id) {
    $location.path('/map').search({detail: id});
  };
}]);
