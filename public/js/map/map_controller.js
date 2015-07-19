angular.module('map', [])
  .controller('MapCtrl', function($scope, $http, $rootScope){
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
    });


    // initializes map
    var options = {
      zoom: 14,
      styles: mapStyle,
      disableDefaultUI: true
    }

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), options);

    // toggle for map qualities according to zoom level
    $scope.zoomedIn = false;

    // getMapBounds used by requestPosts
    $scope.getMapBounds = function(){
      var bounds = $scope.map.getBounds();
      var northEast = bounds.getNorthEast();
      var southWest = bounds.getSouthWest();

      return {n: northEast.lat(), e: northEast.lng(), s: southWest.lat(), w: southWest.lng()}
    }

    // GET request to server
    $scope.requestPosts = function() {
      var bounds = $scope.getMapBounds();
      $http.get('/api/emotions?n=' + bounds.n + '&e=' + bounds.e + '&s=' + bounds.s + '&w=' + bounds.w)
        .then(function(data){
          $scope.dataPoints = data.data;
          $scope.map.set('styles', mapStyle);
          $scope.zoomedIn = false;
          initHeatLayers();
          $scope.addData();
        })
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

    // checks zoom and toggles map options accordingly
    var checkZoom = function(){
      if ($scope.map.getZoom() > 15){
        if (!$scope.zoomedIn) toggleZoomedIn();
      } else {
        if ($scope.zoomedIn) toggleZoomedOut();
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
      angular.forEach($scope.dataPoints, function(pin){

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
            $scope.emotiondata = pin;
            $scope.$apply();
            $('#modal1').openModal();
          });

          // holds the markers on $scope so they can be removed later
          $scope.markers.push(marker);
        }
      })
    }

    var removeMarkers = function() {
      angular.forEach($scope.markers, function(e){
        e.setMap(null);
        google.maps.event.clearListeners(e);
      });
      $scope.markers = [];
    }

    $scope.addData = function(data){
      // ensures initial trip to the server has been made
      if ($scope.dataPoints) {
        $rootScope.socket.on('list new post', function(data){
          // any new post will be added & $apply will update scope
          $scope.dataPoints.push(data);
          if (data.emotion === "rant") {
            $scope.rantHeat.data.push(new google.maps.LatLng(data.lat, data.lng));
          } else {
            $scope.raveHeat.data.push(new google.maps.LatLng(data.lat, data.lng));
          }
        });
      }
    }


    // makes initial api call
    google.maps.event.addListenerOnce($scope.map, 'tilesloaded', $scope.requestPosts);
    google.maps.event.addListener($scope.map, 'zoom_changed', checkZoom);

    return $scope;
  })
