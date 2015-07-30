angular.module('landing', [])

  .controller('LandingCtrl', ['cloudAnimation','$rootScope','$scope','$http','$window','$location', function(cloudAnimation, $rootScope, $scope, $http, $window, $location){

    // google analytics
    ga('send', 'pageview', '/#/landing');  
    cloudAnimation.runClouds();

    $scope.openLogin = function() {
      $('#logInModal').openModal({
        complete: function(){ $scope.user={}; }
      });
    };
    $scope.openSignup = function() {
      $('#signUpModal').openModal({
        complete: function(){ $scope.user={}; }
      });
    };


    $scope.login = function(e){
        $('#logInModal').closeModal();
      // google analytics
      ga('send', 'event', 'form', 'submit', 'login form submit');

      $http.post('/login', $scope.user)
        .success(function(data, status, header, config){
          if (status === 200) {
            /// grant sesssions token
            $window.sessionStorage.token = data.token;
            $window.sessionStorage.user_id = data.id;
            /// initial client socket
            $rootScope.currentuser = {id: data.id};
            $rootScope.socket = io();
            /// add user to socket with session token
            // $rootScope.socket.emit('addUser', $rootScope.currentuser);
            $location.path('/map');
          } else {
            alert(data.error);
          }
        }).error(function(data, status, header, config){
          alert(data.error);
        });
    };


    //------------------ sign-up  ------------------ 

    $scope.validateEmail = function() {
      if (!$scope.user.email) {
        $scope.emailerror = "email is required";
      } else if (!$scope.user.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
        $scope.emailerror = "invalid email";
      }
    };
    $scope.validatePassword = function() {
      if ($scope.user.password && $scope.user.password === $scope.user.confirmpassword) {
        $scope.passworderror = "";
      } else if ($scope.passwordblur && $scope.confirmblur) {
        $scope.passworderror = "passwords don't match";
      }
    };
    $scope.signUp = function(){
        $('#signUpModal').closeModal();
      // google analytics
      ga('send', 'event', 'form', 'submit', 'signup form submit')

      if ($scope.passworderror || !$scope.user.password || $scope.user.password !== $scope.user.confirmpassword) {
        $scope.passwordblur = true;
        $scope.confirmblur = true;
        $scope.validatePassword();
        alert("passwords don't match");
      } else if ($scope.emailerror || !$scope.user.email) {
        $scope.validateEmail();
        alert("invalid email");
      } else {
        console.log("recorded user data as : "+ $scope.user);
        
        $http.post('/signup', $scope.user)
          .success(function(data, status, header, config){

            $window.sessionStorage.token = data.token;
            $window.sessionStorage.user_id = data.id;
            /// initial client socket
            $rootScope.currentuser = {id: data.id};
            $rootScope.socket = io();
            $location.path('/map');
          }).error(function(data, status, header, config){
            alert(data.error);
          });
      }
    };

}]);
