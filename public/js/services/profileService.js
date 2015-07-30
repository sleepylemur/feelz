angular.module('profileService', [])
  .factory('profileService', ['$rootScope', '$q', '$window', '$http', function($rootScope, $q, $window, $http) {

  if ($window.sessionStorage.token){
    getProfile();
  }

  function getProfile(user_id){
    return $q(function(resolve,reject) {
      // passing token to verify current user
      if (typeof user_id === 'undefined') user_id = $window.sessionStorage.user_id;
      $http.get('/api/users/'+user_id).then(function(data){
        if (data.status !== 200) {
          profile = "not found"
          resolve(profile);
        } else {
          profile = data.data;
          resolve(profile);
        }
      }).catch(function(err) {
        console.log('profileService had trouble loading posts: '+err.error);
        reject(err);
      });
    });
  }

  function editProfile(profile){
    $http.post('/api/profile/edit', profile).success(function(data, status, header, config){

        console.log('editProfile success ', data);

      }).error(function(data, status, header, config){

        console.log('editProfile fails', data.error);

      });
  }

  return{
    getProfile: getProfile,
    editProfile: editProfile
  };

}]);
