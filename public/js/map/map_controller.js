angular.module('map', [])
  .controller('MapCtrl', function($scope, $http){
    var options = {
      center: {lat: 40.7397645, lng: -73.9894801},
      zoom: 10,
      styles: mapStyle
    }

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), options);

    $scope.heatLayer = function(map){
      $http.get('listposts').success(function(data){

        var locData = [];
        data.forEach(function(e, i){
          locData.push(new google.maps.LatLng(e.location[0], e.location[1]))
        })

        $scope.heatmap = new google.maps.visualization.HeatmapLayer({data: locData});
        $scope.heatmap.setMap(map);
      })
    }

    $scope.heatLayer($scope.map)
    return $scope;
  })