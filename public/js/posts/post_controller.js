angular.module('post',[])
  .controller('postCtrl', function($routeParams, $http, $scope, $window, $location){
    $http.get('/api/post/'+$routeParams.id)
      .success(function(data, status, header, config){
        $scope.post = data;
        $location.path('/map');
      }).error(function(data, status, header, config){
        alert("post failed!!!"  + data.error);
      });
  })
