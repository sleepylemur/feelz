angular.module('navbar', [])
  .factory('navbar', [function(){
    var nav = {};
    nav.highlight = function(index){
      $('.navlist-selected').attr('class', '');
      console.log($('.navlist').find('li'))
      $('.navlist').find('li').eq(index).attr('class', 'navlist-selected');
    }
    return nav;
  }])