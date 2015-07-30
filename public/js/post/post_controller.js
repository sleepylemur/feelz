angular.module('post', [])
.controller('postCtrl', ['$scope', '$location', '$routeParams', 'postService', 'voteService', function($scope, $location, $routeParams, postService, voteService){
  voteService.getVotes().then(function(data) {
    $scope.votes = data;
  });
  $scope.voteService = voteService;

  postService.getPost(Number($routeParams.post_id)).then(function(data) {
    $scope.post = data;
  });

  $scope.fetchProfile = function(user_id) {
      $location.path('/profile/' + user_id);
  };
  $scope.$on('updatevote', function(event,data) {
    console.log('update: ',data);
  });

  $scope.goToMap = function(id) {
    $location.path('/map').search({detail: id});
  };
}]);
