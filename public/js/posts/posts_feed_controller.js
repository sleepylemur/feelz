angular.module('feeds', [])
  .controller('newsfeedCtrl', function($http,$location, $routeParams, $rootScope, $scope, $window){
    $http.get('/api/newsFeed')
      .success(function(data, status, header, config){
          $scope.feeds = data
      }).error(function(data, status, header, config){
        console.log("feeds fetch err: "  + data);
      });
      $rootScope.socket.on('list new post', function(data){
        // any new post will be added & $apply will update scope
          $scope.feeds.push(data);
          $scope.$apply();
      });
  });
