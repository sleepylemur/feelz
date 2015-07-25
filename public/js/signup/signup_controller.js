angular.module('signup',[])
  .controller('SignUpCtrl', function($rootScope, $scope, $http, $location, $window){
    // google analytics
    ga('send', 'pageview', '/#/signup');

    $('#map-container').css('display', 'none');

    $scope.user = {};
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
  });
