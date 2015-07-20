angular.module('momentfilter', [])
  .filter('fromNow', function() {
    return function(input) {
      if (input) {
        // return "dogs";
        return moment(input).fromNow();
      } else {
        return input;
      }
    };
  });
