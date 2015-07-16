angular.module('post',[])
  .controller('postCtrl', function($routeParams, $http, $scope, $window, $location){
    console.log($routeParams.id);
    $http.get('/api/post', {params:{id : $routeParams.id}})
      .success(function(data, status, header, config){
          $scope.post = data
          console.log(data);
      }).error(function(data, status, header, config){
        console.log("failed!!!"  + data);
      });
  })
