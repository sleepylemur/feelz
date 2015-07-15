angular.module('map', [])
  .controller('MapCtrl', function($scope){
    var options = {
      center: {lat: 40.7397645, lng: -73.9894801},
      zoom: 10,
      styles: mapStyle
    }

    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), options);

    return $scope;
  })