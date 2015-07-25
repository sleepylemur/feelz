angular.module('feedNew', ['momentfilter','postService','voteService'])
  .controller('feedNewCtrl', function(voteService, postService, $window, $http, $location, $routeParams, $rootScope, $scope, $window){
    // google analytics
    ga('send', 'pageview', '/#/feednew');

    $rootScope.title = "FEED";

    var lastscroll = 0;
    $(window).scroll(function(event) {

      var scrollTopVal = $(this).scrollTop();
      console.log(scrollTopVal);
      if (scrollTopVal < 40) {
        $('header').css({top: '0px'});
        $('#feedToggleBar').css({top: '40px'});
      } else if(scrollTopVal > 40 && scrollTopVal - lastscroll < 0){
        $('header').css({top: '-64px'});
        $('#feedToggleBar').css({top: '0px'});
      }else{
        $('header').css({top: '-64px'});
        $('#feedToggleBar').css({top: '-64px'});
      }
      lastscroll = scrollTopVal;
    });

    voteService.getVotes().then(function(data) {
      $scope.votes = data;
    });
    $scope.voteService = voteService;
    //
    // $scope.upVote = function(post_id) {
    //   voteService.addVote(post_id);
    // };

    postService.getPosts().then(function(data) {
      var arr = data.slice(-21);
      arr.reverse();
      $scope.feeds = arr;
    });

    // receive message from postService to add a post to our list
    $scope.$on('newpost', function(event,data) {
      $scope.$apply(function() {
        $scope.feeds.unshift(data);
        if ($scope.feeds.length > 21) $scope.feeds.pop();
      });
    });


    $scope.loadDetail = function(id) {
      $location.path('/map').search({detail: id});
    }
  });
