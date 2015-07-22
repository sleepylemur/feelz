angular.module('mapinitializer', [])
  .factory('mapinitializer', function(){
    var options = {
      zoom: 14,
      styles: mapStyle,
      disableDefaultUI: true
    }

    var pandaMap = new google.maps.Map(document.getElementById('map-canvas'), options);
    return {pandaMap: pandaMap, loadedOnController: false};
  })