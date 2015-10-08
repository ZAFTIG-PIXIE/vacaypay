(function() {
  'use strict';

  angular.module('app')
  .controller('AuthController', ['$scope', '$window', '$state', '$timeout', 'Auth', 
  function ($scope, $window, $state, $timeout, Auth) {
    $scope.user = {};
    $scope.user.userInfoError = false;
    //Sign in function and store token into local storage
    //then change state to currentTrip.html

    $scope.displayUserInfoError = function () {
      $scope.user.userInfoError = true;
      $timeout(function () {
        $scope.user.userInfoError = false;
      }, 3000);
    }

    $scope.signin = function () {
      Auth.signin($scope.user, function (token, err) {
        if (!err) {
          $window.localStorage.setItem('com.vacaypay', token);
          $state.transitionTo('currentTrip.expense');
          $scope.signinForm.$setPristine();
        } else {
          $scope.displayUserInfoError();
        }
      });
    };
    //Sign up function and store token into local storage
    //then change state to currentTrip.html
    $scope.signup = function () {
      Auth.signup($scope.user, function (token, err) {
        if (!err) {
          $window.localStorage.setItem('com.vacaypay', token);
          $state.transitionTo('currentTrip.expense');
          $scope.signupForm.$setPristine();   
        } else {
          $scope.displayUserInfoError();
        }
      });
    };
  }]);
})();
