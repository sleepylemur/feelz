angular.module('map', ['postService'])
  .controller('MapCtrl', function(postService, $scope, $http, $rootScope, $routeParams){

    $rootScope.title = "Map";

    // getMapBounds used by requestPosts
    $scope.getMapBounds = function(){
      var bounds = $scope.map.getBounds();
      var northEast = bounds.getNorthEast();
      var southWest = bounds.getSouthWest();

      return {n: northEast.lat(), e: northEast.lng(), s: southWest.lat(), w: southWest.lng()}
    }

    var showHeatLayers= function() {
      $scope.rantHeat.setMap($scope.map);
      $scope.raveHeat.setMap($scope.map);
    };
    var initHeatLayers = function() {
      // console.log('disposing');
      var rants = [];
      var raves = [];

      // create google maps latlng objects split by emotion
      angular.forEach($scope.dataPoints, function(e){
        if (e.lat && e.lng){
          if (e.emotion === 'rant'){
            rants.push({location: new google.maps.LatLng(e.lat, e.lng), weight: 0.05});
            // rants.push(new google.maps.LatLng(e.lat, e.lng));
          } else {
            raves.push(new google.maps.LatLng(e.lat, e.lng));
          }
        }
      });


      var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ];


      $scope.rantHeat = new google.maps.visualization.HeatmapLayer({data: rants, radius: 0.003, dissipating: false});
      $scope.raveHeat = new google.maps.visualization.HeatmapLayer({data: raves, gradient: gradient, radius: 0.003, dissipating: false});

      $scope.rantHeat.setMap($scope.map);
      $scope.raveHeat.setMap($scope.map);
    }

    var removeHeatLayers = function(){
      $scope.rantHeat.setMap(null);
      $scope.raveHeat.setMap(null);
    }

    var isloaded = false;
    // checks zoom and toggles map options accordingly
    function markloaded() {
      isloaded = true;
      checkZoom();
    }
    function checkZoom(){
      if (isloaded) {
        if ($scope.map.getZoom() > 15){
          if (!$scope.zoomedIn) toggleZoomedIn();
        } else {
          if ($scope.zoomedIn) toggleZoomedOut();
        }
      }
    }

    // called by checkZoom
    var toggleZoomedIn = function(){
      removeHeatLayers();
      addMarkers();
      $scope.map.set('styles', null);
      $scope.zoomedIn = true;
    }

    // called initially and by checkZoom
    var toggleZoomedOut = function() {
      removeMarkers();
      showHeatLayers();
      $scope.map.set('styles', mapStyle);
      $scope.zoomedIn = false;
    }

    var addMarkers = function() {
      $scope.markers = [];
      var bounds = $scope.getMapBounds();

      // iterates over current data points--if data points are near current map bounds,
      // markers are instantiated and placed on the map.
      postService.getPosts().then(function(posts) {
        posts.forEach(function(pin){

          if (pin.lat < bounds.n + 0.01 && pin.lat > bounds.s - 0.01 &&
            pin.lng < bounds.e + 0.01 && pin.lng > bounds.w - 0.01) {

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(pin.lat, pin.lng),
              map: $scope.map
            });
            marker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillOpacity: 1,
              strokeColor: '#000000',
              fillColor: '#ffffff'
            })

            // sets a click event on each individual marker
            google.maps.event.addListener(marker, 'click', function(){
              triggerDetail(pin);
            });

            // holds the markers on $scope so they can be removed later
            $scope.markers.push(marker);
          }
        });
      });
    }

    function triggerDetail(pin) {
      $scope.$apply(function(){
        $scope.emotiondata = pin;
      });
      $scope.map.panTo(new google.maps.LatLng(pin.lat, pin.lng));
      $('#modalPostDetail').openModal();
    }

    var removeMarkers = function() {
      angular.forEach($scope.markers, function(e){
        e.setMap(null);
        google.maps.event.clearListeners(e);
      });
      $scope.markers = [];
    }

    // update heatmap as new posts come in
    $scope.$on('newpost', function(event,post) {
      $scope.$apply(function() {
        if (post.emotion === "rant") {
          $scope.rantHeat.data.push(new google.maps.LatLng(post.lat, post.lng));
        } else {
          $scope.raveHeat.data.push(new google.maps.LatLng(post.lat, post.lng));
        }
      });
    });

    // initializes map
    if (!$scope.map) {
      var options = {
        zoom: 14,
        styles: mapStyle,
        disableDefaultUI: true
      }
      // toggle for map qualities according to zoom level

      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), options);

      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      });

      // makes initial api call
      google.maps.event.addListenerOnce($scope.map, 'tilesloaded', markloaded);
      google.maps.event.addListener($scope.map, 'zoom_changed', checkZoom);

      postService.getPosts().then(function(posts) {
        $scope.dataPoints = posts;
        $scope.map.set('styles', mapStyle);
        $scope.zoomedIn = false;
        initHeatLayers();

        handleCentering();
      });
    } else {
      isloaded = true;
      handleCentering();
    }

    function handleCentering() {
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
