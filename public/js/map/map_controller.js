angular.module('map', ['postService', 'mapinitializer', 'voteService'])
  .controller('MapCtrl', function(voteService, postService, $scope, $http, $rootScope, $routeParams, mapinitializer){

    $rootScope.title = "Map";
    $scope.voteService = voteService;
    voteService.getVotes().then(function(data) {
      $scope.votes = data;
    });

    $scope.map = mapinitializer.pandaMap;
    // google.maps.event.trigger(mapinitializer.pandaMap,'resize')
    // $('#map-container').css('display: inline');

    // handleResize();
    if (!mapinitializer.dataFetched) mapinitializer.fetchData();

    mapinitializer.triggerDetail = triggerDetail;

    handleCentering();
    // handleResize();

    // $scope.map.setCenter(new google.maps.LatLng(40.7281131,-73.9969843));
    // google.maps.event.trigger($scope.map, 'resize');

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
            // $scope.map.setZoom(16);
            setTimeout(function() {
              setTimeout(function() {
                $scope.map.setZoom(16);
              },0);
              triggerDetail(targetpost);
            }, 500);
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
      $('#modalPostDetail').openModal();
    }

    $scope.post = {};
    // open modal to write new post
    $scope.newPost = function() {
      $('#modalNewPost').openModal();
    };
    // submit our post to the server
    $scope.submitNewPost = function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.post.lat = position.coords.latitude;
        $scope.post.lng = position.coords.longitude;
        $scope.post.emotion = $scope.post.rantrave ? 'rave' : 'rant';

        $http.post('/api/posts', $scope.post).success(function(data, status, header, config){
          $('#modalNewPost').closeModal();
          handleResize();
          // clear out modal for next use
          $scope.post = {};
          $('#imagepreview').attr('src','images/placeholder.png');
        }).error(function(data, status, header, config){
          alert("post failed!!!"  + data.error);
        });
      });
    };
    // trigger the browse file dialog
    $scope.fileDialog = function() {
      $('#filepicker').click();
    };
    // browse file dialog closed so upload our file and replace placeholder with the returned url
    $scope.uploadFile = function() {
      var file = $('#filepicker')[0].files[0];
      var fd = new FormData(); // FormData requires >= ie10
      if (file.type.match('image.*')) {
        fd.append('image', file, file.name);

        $http.post('/imageUpload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined} // undefined causes the browser to fill in the needed details
        })
        .success(function(url){
          console.log('uploaded',url);
          $scope.post.image_url = url;
          // $('#imagepreview').attr('src',url);
        })
        .error(function(e){
          alert('error '+e);
        });
      } else {
        alert('not an image file');
      }
    };
  })
