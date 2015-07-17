angular.module('feeds', [])
  .controller('newsfeedCtrl', function( $http,$location, $routeParams, $rootScope, $scope, $window){
    $http.get('/api/newsFeed')
      .success(function(data, status, header, config){
          $scope.feeds = data
      }).error(function(data, status, header, config){
        console.log("news feed fetch failed!!!"  + data);
      });
      $rootScope.socket.on('new post', function(data){
          $scope.feeds = $scope.feeds.push(data);
          console.log($scope.feeds);
      });
  });
