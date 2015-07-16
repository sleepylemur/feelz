angular.module('post',[])
  .controller('postCtrl', function($routeParams, $http, $scope, $window, $location){
    $http.get('/api/post', {params:{id : $routeParams.id}})
      .success(function(data, status, header, config){
          $scope.post = data
      }).error(function(data, status, header, config){
        console.log("post failed!!!"  + data);
      });
  })
