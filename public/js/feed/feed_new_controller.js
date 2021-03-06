angular.module('feedNew', ['momentfilter','postService','voteService'])
  .controller('feedNewCtrl', ['voteService', 'postService', '$window', '$http', '$location', '$routeParams', '$rootScope', '$scope', '$window', function(voteService, postService, $window, $http, $location, $routeParams, $rootScope, $scope, $window){
    // google analytics
    ga('send', 'pageview', '/#/feednew');


    var lastscroll = 0;
    $(window).scroll(function(event) {
      var scrollTopVal = $(this).scrollTop();
      if (scrollTopVal < 30) {
        $('header').css({top: '0px'});
        $('#feedToggleBar').css({top: '40px'});
      } else if(scrollTopVal > 30 && scrollTopVal - lastscroll < 0){
        $('header').css({top: '-40px'});
        $('#feedToggleBar').css({top: '0px'});
      }else{
        $('header').css({top: '-40px'});
        $('#feedToggleBar').css({top: '-40px'});
      }
      lastscroll = scrollTopVal;
    });

    $scope.triggerVote = function(post_id) {
      voteService.addVote(post_id);
    };

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
      $location.path('/post/' + id);
    }

    $scope.goToMap = function(id) {
      $location.path('/map').search({detail: id});
    }

  }]);
