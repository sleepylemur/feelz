angular.module('map', [])
  .controller('MapCtrl', function($scope, $http){

    // gets user geolocation data
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
    });

    // initializes map
    var options = {
      zoom: 14,
      styles: mapStyle
    }

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), options);


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
          disposeHeatLayers();
          disposeMarkers();  
        })
    }

    var disposeHeatLayers = function() {

      var rants = [];
      var raves = [];

      // create google maps latlng objects split by emotion
      angular.forEach($scope.dataPoints, function(e){

        if (e.location){

          if (e.emotion === 'rant'){
            rants.push(new google.maps.LatLng(e.location[0], e.location[1]));
          } else {
            raves.push(new google.maps.LatLng(e.location[0], e.location[1]));
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

      $scope.rantHeat = new google.maps.visualization.HeatmapLayer({data: rants});
      $scope.raveHeat = new google.maps.visualization.HeatmapLayer({data: raves, gradient: gradient});

      $scope.rantHeat.setMap($scope.map);
      $scope.raveHeat.setMap($scope.map);
    }

    // checks to see whether markers should be added or removed
    var disposeMarkers = function() {
      if ($scope.map.getZoom() > 15) {
        addMarkers();
      } else if ($scope.markers && $scope.markers.length > 0) {
        removeMarkers();
      }
    }

    var addMarkers = function() {

      $scope.markers = [];

      angular.forEach($scope.dataPoints, function(e){
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(e.location[0], e.location[1]),
          map: $scope.map
        });

        // sets a click event on each individual marker
        google.maps.event.addListener(marker, 'click', function(){
          console.log(e.message)
        });

        // holds the markers on $scope so they can be removed later
        $scope.markers.push(marker);
      })
    }

    var removeMarkers = function() {
      angular.forEach($scope.markers, function(e){
        e.setMap(null);
      });
    }

    $scope.addData = function(data){
      // ensures initial trip to the server has been made
      if ($scope.dataPoints) {
        $scope.dataPoints.push(data);
        disposeHeatLayers();
        disposeMarkers();
      }
    }


    // makes initial api call
    google.maps.event.addListenerOnce($scope.map, 'tilesloaded', $scope.requestPosts);
    
    google.maps.event.addListener($scope.map, 'zoom_changed', disposeMarkers);

    return $scope;
  })
