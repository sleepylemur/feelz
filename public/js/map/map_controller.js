angular.module('map', [])
  .controller('MapCtrl', function($scope, $http){
    navigator.geolocation.getCurrentPosition(function(position) {
      var options = {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 10,
        styles: mapStyle
      }
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), options);
    });


    // initializes heat layer, GET request to the server.
    $scope.heatLayer = function(){
      $http.get('listposts').success(function(data){

        var locData = [];
        data.forEach(function(e, i){
          locData.push(new google.maps.LatLng(e.location[0], e.location[1]))
        })

        $scope.heatmap = new google.maps.visualization.HeatmapLayer({data: locData});
        $scope.heatmap.setMap($scope.map);
      })
    };


    $scope.addMarkers = function(){
      $http.get('listposts').success(function(data){
        $scope.markers = data.map(function(e){
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(e.location[0], e.location[1]),
            map: $scope.map,
            title: e.message
          })
          google.maps.event.addListener(marker, 'click', function(){
            console.log(e.message);
          })
          return marker;
        });
      });
    };

    $scope.checkZoom = function(){
      if ($scope.map.getZoom() > 15) {
        $scope.addMarkers($scope.map)
      } else if ($scope.markers){
        $scope.removeMarkers($scope.map);
      }
    };
    google.maps.event.addListener($scope.map, 'zoom_changed', $scope.checkZoom)

    $scope.heatLayer($scope.map);
    return $scope;
  })
