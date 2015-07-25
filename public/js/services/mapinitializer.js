angular.module('mapinitializer', ['postService'])
  .factory('mapinitializer', function($rootScope, postService, $window){

    // object to export
    var mappy = {};
    mappy.dataFetched = true;

    // to be called in the main controller
    mappy.mapInit = function(){
      // obtains user geolocation data
      navigator.geolocation.getCurrentPosition(function(position) {
        mappy.clientLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        mappy.pandaMap.setCenter(mappy.clientLatLng);
      });

      mappy.zoomedIn = false;

      var options = {
        zoom: 14,
        styles: mapStyle,
        disableDefaultUI: true
      }

      mappy.pandaMap = new google.maps.Map(document.getElementById('map-canvas'), options);

      google.maps.event.addListenerOnce(mappy.pandaMap, 'tilesloaded', mappy.checkZoom);
      google.maps.event.addListener(mappy.pandaMap, 'zoom_changed', mappy.checkZoom);

      if ($window.sessionStorage.token) {
        mappy.fetchData();
      } else {
        mappy.dataFetched = false;
      }
    }

    mappy.fetchData = function() {
      postService.getPosts().then(function(posts) {
        mappy.dataPoints = posts;
        mappy.pandaMap.set('styles', mapStyle);
        initHeatLayers();
        mappy.dataFetched = true;
      })
        .catch(function(err){
          if (err[0].data.status === '401') mappy.dataFetched = false;
        });     
    }

    var getMapBounds = function(){
      var bounds = mappy.pandaMap.getBounds();
      var northEast = bounds.getNorthEast();
      var southWest = bounds.getSouthWest();

      return {n: northEast.lat(), e: northEast.lng(), s: southWest.lat(), w: southWest.lng()}
    };

    var showHeatLayers= function() {
      mappy.rantHeat.setMap(mappy.pandaMap);
      mappy.raveHeat.setMap(mappy.pandaMap);
    };

    var initHeatLayers = function(){
      // two heat layers
      var rants = [];
      var raves = [];

      // create google maps latlng objects split by emotion
      angular.forEach(mappy.dataPoints, function(e){
        if (e.lat && e.lng){
          if (e.emotion === 'rant'){
            rants.push({location: new google.maps.LatLng(e.lat, e.lng), weight: 0.05});
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


      mappy.rantHeat = new google.maps.visualization.HeatmapLayer({data: rants, radius: 0.003, dissipating: false});
      mappy.raveHeat = new google.maps.visualization.HeatmapLayer({data: raves, gradient: gradient, radius: 0.003, dissipating: false});

      mappy.rantHeat.setMap(mappy.pandaMap);
      mappy.raveHeat.setMap(mappy.pandaMap);
    }

    var removeHeatLayers = function(){
      mappy.rantHeat.setMap(null);
      mappy.raveHeat.setMap(null);
    }

    // called by checkZoom
    var toggleZoomedIn = function(){
      removeHeatLayers();
      addMarkers();
      mappy.pandaMap.set('styles', null);
      mappy.zoomedIn = true;
    }

    mappy.checkZoom = function(){
      if (mappy.pandaMap.getZoom() > 15){
        if (!mappy.zoomedIn) toggleZoomedIn();
      } else {
        if (mappy.zoomedIn) toggleZoomedOut();
      }
    }

    // called initially and by checkZoom
    var toggleZoomedOut = function() {
      removeMarkers();
      showHeatLayers();
      mappy.pandaMap.set('styles', mapStyle);
      mappy.zoomedIn = false;
    }

    var addMarkers = function() {
      mappy.markers = [];
      var bounds = getMapBounds();

      // iterates over current data points--if data points are near current map bounds,
      // markers are instantiated and placed on the map.
      postService.getPosts().then(function(posts) {
        posts.forEach(function(pin){

          if (pin.lat < bounds.n + 0.01 && pin.lat > bounds.s - 0.01 &&
            pin.lng < bounds.e + 0.01 && pin.lng > bounds.w - 0.01) {

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(pin.lat, pin.lng),
              map: mappy.pandaMap
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
              mappy.triggerDetail(pin)
            });

            // holds the markers on $scope so they can be removed later
            mappy.markers.push(marker);
          }
        });
      });
    }

    var removeMarkers = function() {
      mappy.markers.forEach(function(e){
        e.setMap(null);
        google.maps.event.clearListeners(e);
      });
      mappy.markers = [];
    }

    return mappy;
  })