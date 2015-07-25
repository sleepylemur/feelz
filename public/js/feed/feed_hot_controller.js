angular.module('feedHot', ['momentfilter','postService','voteService'])
  .controller('feedHotCtrl', function(voteService, postService, $window, $http, $location, $routeParams, $rootScope, $scope, $window){
    // google analytics
    ga('send', 'pageview', '/#/feednew');

    $rootScope.title = "FEED";
    var lastscroll = 0;
    $(window).scroll(function(event) {

      var scrollTopVal = $(this).scrollTop();
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

    postService.getPosts().then(function(data) {
      var arr = data.slice();
      arr.sort(feedSortCallback);
      $scope.feeds = arr.slice(0,21);
    });

    function feedSortCallback(a,b) {
      if (b.numvotes == a.numvotes) {
        return b.timestamp - a.timestamp;
      } else {
        return b.numvotes - a.numvotes;
      }
    }

    // receive message from postService to add a post to our list
    // $scope.$on('newpost', function(event,data) {
    //   $scope.$apply(function() {
    //     $scope.feeds.unshift(data);
    //     if ($scope.feeds.length > 21) $scope.feeds.pop();
    //   });
    // });
    $scope.$on('updatevote', function(event,data) {
      // a new vote was registered, so we need to check if the voted post is now popular enough to show on the hot list.
      // if the voted post has numvotes < the lowest rated post in our list then we skip it.
      if (data.numvotes < $scope.feeds[$scope.feeds.length-1].numvotes) return;
      // if the voted post is already on the hot list then just resort the list and finish.
      for (var i=0; i<$scope.feeds.length; i++) {
        if (data.id === $scope.feeds[i].id) {
          $scope.$apply(function() {
            $scope.feeds.sort(feedSortCallback);
          });
          return;
        }
      }
      // now we know our post is going to replace something in our hot list, so do the actual replacement.
      for (var i=0; i<$scope.feeds.length; i++) {
        if (data.numvotes >= $scope.feeds[i].numvotes) {
          $scope.$apply(function() {
            $scope.feeds.splice(i,0,data);
            $scope.feeds.pop();
          });
          return;
        }
      }
    });


    $scope.loadDetail = function(id) {
      $location.path('/post').search({detail: id});
    }

    $scope.goToMap = function(id) {
      $location.path('/map').search({detail: id});
    }
    
  });
