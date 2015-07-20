angular.module('feedNew', ['momentfilter','postService'])
  .controller('feedNewCtrl', function(postService, $http,$location, $routeParams, $rootScope, $scope, $window){
    // google analytics
    ga('send', 'pageview', '/#/feednew');

    // console.log(moment(new Date() - 1000*60*60*3).fromNow());
    // console.log($rootScope.socket.listeners('list new post'));
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

    // $http.get('/api/newsFeed')
    //   .success(function(data, status, header, config){
    //     $scope.feeds = data;
    //   }).error(function(data, status, header, config){
    //     console.log("feeds fetch err: "  + data);
    //   });
    // function mylistener(data) {
    //   console.log("message!",data);
    //   // any new post will be added & $apply will update scope
    //   $scope.feeds.push(data);
    // }
    // if ($rootScope.socket.listeners('list new post').indexOf(mylistener) === -1) {
    //   $rootScope.socket.on('list new post', mylistener);
    // }
    // console.log($rootScope.socket.listeners('list new post'));
    // // $rootScope.socket.on('list new post', function(data){
    // //   console.log("message!",data);
    // //   // any new post will be added & $apply will update scope
    // //   $scope.feeds.push(data);
    // //   $scope.$apply();
    // // });
    // console.log('?????');
    // console.log('?????');
    // for (var p in $rootScope.socket) {
    //   console.log(p);
    // }
  });
