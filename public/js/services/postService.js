angular.module('postService', [])
  .factory('postService', function($rootScope, $q, $window, $http) {
    var socket;
    var posts;
    if ($window.sessionStorage.token) {
      getPosts();
    }

    function listenToSocket(data) {
      if (posts) {
        // $rootScope.$apply(function() {
        //   posts.push(data);
        // });
        posts.push(data);
        $rootScope.$broadcast('newpost', data);
      }
    }

    function clear() {
      posts = undefined;
      if (socket) {
        socket.removeListener('list new post', listenToSocket);
        socket = undefined;
      }
    }

    function getPosts() {
      if (!socket) {
        socket = io();
        socket.on('list new post', listenToSocket);
      }
      if (posts) {
        return $q.when(posts);
      } else {
        return $q(function(resolve,reject) {
          $http.get('/api/posts').then(function(data){
              posts = data.data;
              resolve(posts);
            }).catch(function(err) {
              console.log('postService had trouble loading posts: '+err.error);
              reject(err);
            });
        });
      }
    }

    return {
      clear: clear,
      getPosts: getPosts
    };
  });
