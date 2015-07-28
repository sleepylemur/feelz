angular.module('map', ['postService', 'mapinitializer', 'voteService'])
  .controller('MapCtrl', ['voteService', 'postService', '$scope', '$http', '$rootScope', '$routeParams', 'mapinitializer', '$location', function(voteService, postService, $scope, $http, $rootScope, $routeParams, mapinitializer, $location){

    $scope.voteService = voteService;
    voteService.getVotes().then(function(data) {
      $scope.votes = data;
    });

    $scope.map = mapinitializer.pandaMap;

    if (!mapinitializer.dataFetched) mapinitializer.fetchData();

    mapinitializer.triggerDetail = triggerDetail;

    handleCentering();

    function handleResize() {
      console.log('handleResize');
      var center = $scope.map.getCenter();
      google.maps.event.trigger($scope.map, 'resize');
      $scope.map.setCenter(center);
    }

    function handleCentering() {
      console.log('handleCentering');
      // if we have a target, then zoom map to that
      if ($routeParams.detail) {
        postService.getPosts().then(function(posts) {
          for (var i=0;i<posts.length;i++) {
            if (posts[i].id == $routeParams.detail) break;
          }
          if (i < posts.length) {
            var targetpost = posts[i];
            $scope.map.setZoom(16);
            $scope.map.panTo(new google.maps.LatLng(targetpost.lat, targetpost.lng));
            // $scope.map.setZoom(16);
            // setTimeout(function() {
            //   setTimeout(function() {
            //     $scope.map.setZoom(16);
            //   },0);
            //   triggerDetail(targetpost);
            // }, 500);
          } else {
            console.log("no post found with id: "+$routeParams.detail);
          }
        });
      }
    }

    function triggerDetail(pin) {
      console.log('triggerDetail');
      $scope.emotiondata = pin;
      $scope.map.panTo(new google.maps.LatLng(pin.lat, pin.lng));
      setTimeout(function() {
        $scope.$apply(function() {
          $location.path('/post/' + pin.id);
        });
      }, 100);
    // setTimeout(function() {
      // }, 500);
      // $('#modalPostDetail').openModal();
    }

}])
