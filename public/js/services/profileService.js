angular.module('profileService', [])
  .factory('profileService', ['$rootScope', '$q', '$window', '$http', function($rootScope, $q, $window, $http) {
  
  if ($window.sessionStorage.token){
    getProfile();
  }

  function getProfile(){
    return $q(function(resolve,reject) {
      $http.get('/api/profile').then(function(data){
        if (data.status !== 200) {
          console.log(arguments);
          console.log(data.data);
          profile ="not found"
          resolve(profile);
        }else{
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

  function getOtherProfile(user_id){
    return $q(function(resolve, reject){
      $http.get('./api/users', user_id).then(function(data){
        if(data.status !== 200){
          console.log(arguments); 
          console.log(data.data); 
          user = "not found"
          resolve(user); 
        }else{
          user = data.data; 
          resolve(user); 
        }
      }).catch(function(err){
        console.log('profileService unable to fetch user profile: '+err.error); 
        reject(err); 
      }); 
    });
  }

  return{
    getProfile: getProfile, 
    editProfile: editProfile, 
    getOtherProfile: getOtherProfile 
  };
}]);