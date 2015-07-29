angular.module('mapinitializer', ['postService'])
  .factory('mapinitializer', ['$rootScope', 'postService', '$window', function($rootScope, postService, $window){

    // object to export
    var mappy = {};
    mappy.dataFetched = true;

    // to be called in the main controller
    mappy.mapInit = function(){
      console.log('mapInit');
      // obtains user geolocation data
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log('geolocated');
        mappy.clientLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        mappy.pandaMap.panTo(mappy.clientLatLng);
      });

      mappy.zoomedIn = false;

      var options = {
        center: new google.maps.LatLng(40.7281131,-73.9969843),
        zoom: 14,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
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
      console.log('fetchData');
      postService.getPosts().then(function(posts) {
        console.log('data fetched');
        mappy.dataPoints = posts;
        mappy.pandaMap.set('styles', mapStyle);
        initHeatLayers();
        mappy.dataFetched = true;
      }).catch(function(err){
        console.log('data fetch failed');
        if (err[0].data.status === '401') mappy.dataFetched = false;
      });
    }

    var getMapBounds = function(){
      console.log('getMapBounds');
      var bounds = mappy.pandaMap.getBounds();
      var northEast = bounds.getNorthEast();
      var southWest = bounds.getSouthWest();

      return {n: northEast.lat(), e: northEast.lng(), s: southWest.lat(), w: southWest.lng()}
    };

    var showHeatLayers= function() {
      console.log('showHeatLayers');
      mappy.rantHeat.setMap(mappy.pandaMap);
      mappy.raveHeat.setMap(mappy.pandaMap);
    };

    var initHeatLayers = function(){
      console.log('initHeatLayers');
      // two heat layers
      var rants = [];
      var raves = [];

      // create google maps latlng objects split by emotion
      angular.forEach(mappy.dataPoints, function(e){
        if (e.lat && e.lng){
          if (e.emotion === 'rant'){
            rants.push({location: new google.maps.LatLng(e.lat, e.lng), weight: 0.3});
          } else {
            raves.push({location: new google.maps.LatLng(e.lat, e.lng), weight: 0.3});
          }
        }
      });


      var rantgradient =
      [ 'rgba(40,0,140,0)',
        'rgba(40,0,160,0.3)',
        'rgba(40,0,190,0.6)',
        'rgba(20,0,220,1)',
        'rgba(0,0,245,1)',
        'rgba(0,10,255,1)',
        'rgba(0,50,255,1)',
        'rgba(0,80,255,1)',
        'rgba(0,110,255,1)',
        'rgba(0,130,255,1)',
        'rgba(0,150,255,1)',
        'rgba(0,170,255,1)',
        'rgba(0,192,255,1)',
        'rgba(80,215,255,1)',
        'rgba(110,235,255,1)',
        'rgba(150,245,255,1)'
      ];

      var ravegradient = [
        'rgba(255,152,0,0)',
        'rgba(255,165,0,0.3)',
        'rgba(255,180,0,0.6)',
        'rgba(255,203,0,1)',
        'rgba(255,223,0,1)',
        'rgba(255,226,30,1)',
        'rgba(255,230,70,1)',
        'rgba(255,237,120,1)',
        'rgba(255,240,150,1)',
        'rgba(255,243,167,1)'
      ];
      // var ravegradient = [
      // ]
      // var gradient = [
      //   'rgba(0, 255, 255, 0)',
      //   'rgba(0, 255, 255, 1)',
      //   'rgba(0, 191, 255, 1)',
      //   'rgba(0, 127, 255, 1)',
      //   'rgba(0, 63, 255, 1)',
      //   'rgba(0, 0, 255, 1)',
      //   'rgba(0, 0, 223, 1)',
      //   'rgba(0, 0, 191, 1)',
      //   'rgba(0, 0, 159, 1)',
      //   'rgba(0, 0, 127, 1)',
      //   'rgba(63, 0, 91, 1)',
      //   'rgba(127, 0, 63, 1)',
      //   'rgba(191, 0, 31, 1)',
      //   'rgba(255, 0, 0, 1)'
      // ];


      mappy.rantHeat = new google.maps.visualization.HeatmapLayer({data: rants, gradient: rantgradient, radius: 0.0030, dissipating: false});
      mappy.raveHeat = new google.maps.visualization.HeatmapLayer({data: raves, gradient: ravegradient, radius: 0.0030, dissipating: false, maxIntensity:});

      mappy.rantHeat.setMap(mappy.pandaMap);
      mappy.raveHeat.setMap(mappy.pandaMap);
    }

    var removeHeatLayers = function(){
      console.log('removeHeatLayers');
      mappy.rantHeat.setMap(null);
      mappy.raveHeat.setMap(null);
    }

    // called by checkZoom
    var toggleZoomedIn = function(){
      console.log('toggleZoomedIn');
      removeHeatLayers();
      addMarkers();
      mappy.pandaMap.set('styles', null);
      mappy.zoomedIn = true;
    }

    mappy.checkZoom = function(){
      console.log('checkZoom');
      if (mappy.pandaMap.getZoom() > 15){
        if (!mappy.zoomedIn) toggleZoomedIn();
      } else {
        if (mappy.zoomedIn) toggleZoomedOut();
      }
    }

    // called initially and by checkZoom
    var toggleZoomedOut = function() {
      console.log('toggleZoomedOut');
      removeMarkers();
      showHeatLayers();
      mappy.pandaMap.set('styles', mapStyle);
      mappy.zoomedIn = false;
    }

    var addMarkers = function() {
      var ravecolor = '#ffd54f';
      var rantcolor = '#3f51b5';

      console.log('addMarkers');
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
              strokeColor: pin.emotion == 'rave' ? ravecolor : rantcolor,
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

      console.log('removeMarkers');
      mappy.markers.forEach(function(e){
        e.setMap(null);
        google.maps.event.clearListeners(e);
      });
      mappy.markers = [];
    }

    return mappy;
  }]);
