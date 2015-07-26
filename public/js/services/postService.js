angular.module('postService', [])
  .factory('postService', function($rootScope, $q, $window, $http) {
    var socket;
    var posts;
    if ($window.sessionStorage.token) {
      getPosts();
    }

    function newPostFromSocket(data) {
      if (posts) {
        // $rootScope.$apply(function() {
        //   posts.push(data);
        // });
        posts.push(data);
        $rootScope.$broadcast('newpost', data);
      }
    }
    function updatePostFromSocket(data) {
      data.numvotes = Number(data.numvotes);
      // using linear search for now. because our posts are sorted by date, it should be possible to do a smarter lookup
      for (var i = 0; i< posts.length; i++) {
        if (posts[i].id == data.id) break;
      }
      if (i < posts.length) {
        // we found our post so update it
        $rootScope.$apply(function() {
          posts[i].numvotes = data.numvotes;
        });
        $rootScope.$broadcast('updatevote', data);
      } else {
        // for some reason we didn't find our post... maybe a concurrency issue?
        // just ignore it because numvotes isn't really that important to be accurate
      }
    }

    function clear() {
      posts = undefined;
      if (socket) {
        socket.removeListener('list new post', newPostFromSocket);
        socket.removeListener('update postvotes', updatePostFromSocket);
        socket = undefined;
      }
    }

    function getPost(post_id) {
      function searchPosts(post_id) {
        for (var i=0; i<posts.length; i++) {
          if (posts[i].id == post_id) return posts[i];
        }
      }

      return $q(function(resolve,reject) {
        if (posts) {
          resolve(searchPosts(post_id));
        } else {
          getPosts().then(function() {
            resolve(searchPosts(post_id));
          });
        }
      });
    }

    function getPosts() {
      if (!socket) {
        socket = io();
        socket.on('list new post', newPostFromSocket);
        socket.on('update postvotes', updatePostFromSocket);
      }
      if (posts) {
        return $q.when(posts);
      } else {
        return $q(function(resolve,reject) {
          $http.get('/api/posts').then(function(data){
            if (data.status !== 200) {
              console.log(arguments);
              console.log(data.data);
              posts = [];
              resolve(posts);
            } else {
              posts = data.data;
              // reverse posts so the most recent is at the end
              // to be consistant with our pushing new posts on the end later
              posts.reverse();
              resolve(posts);
            }
          }).catch(function(err) {
            console.log('postService had trouble loading posts: '+err.error);
            reject(err);
          });
        });
      }
    }

    return {
      clear: clear,
      getPosts: getPosts,
      getPost: getPost
    };
  });
