angular.module('voteService', [])
  .factory('voteService', ['$rootScope', '$q', '$window', '$http', function($rootScope, $q, $window, $http) {
    var votes;
    function getVotes() {
      if (votes) {
        // if votes is already loaded, then just wrap it in a promise and return
        return $q.when(votes);
      } else {
        // if votes isn't loaded, then grab from the server
        return $q(function(resolve,reject) {
          $http.get('/api/users/'+$window.sessionStorage.user_id+'/votes').success(function(data,status) {
            votes = {};
            if (status > 200) {
              console.log(data);
            } else {
              data.forEach(function(e) {votes[e.post_id] = true;});
            }
            resolve(votes);
          }).error(function(err) {
            reject(err);
          });
        });
      }
    }
    // function checkVote(post_id) {
    //   if (votes) return votes[post_id];
    //   else return false;
    // }

    function addVote(post_id) {
      console.log('addvote: ',post_id);
      votes[post_id] = true;
      var newvote = {
        user_id: $window.sessionStorage.user_id,
        post_id: post_id
      };
      $http.post('/api/votes', newvote)
        .success(function(result,status) {
          if (status > 200) {
            console.log('vote failed ' + result);
          } else {
            // console.log('successful vote');
          }
        }).error(function(err) {
          console.log('vote failed ' + err.error);
        });
    }
    function clear() {
      votes = undefined;
    }
    return {
      getVotes: getVotes,
      addVote: addVote,
      // checkVote: checkVote,
      clear: clear //used for clearing cache during logout
    };
  }]);
