angular.module('feedNew', ['momentfilter','postService'])
  .controller('feedNewCtrl', function(postService, $http,$location, $routeParams, $rootScope, $scope, $window){
    // google analytics
    ga('send', 'pageview', '/#/feednew');

    postService.getPosts().then(function(data) {
      var arr = data.slice(-21);
      arr.reverse();
      $scope.feeds = arr;
    });
    $scope.$on('newpost', function(event,data) {
      $scope.$apply(function() {
        $scope.feeds.unshift(data);
        $scope.feeds.pop();
      });
    });


    $scope.loadDetail = function() {
      $location.path('/scratch').search({name: 'dave'});
    }
  });
