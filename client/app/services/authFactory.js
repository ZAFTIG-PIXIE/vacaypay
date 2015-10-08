(function() {
  'use strict';

  angular.module('app')
  .factory('Auth', ['$http', '$state', '$window', function ($http, $state, $window) {
    var currentUserId;
    var currentUserName;

    var services = {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      currentUser: currentUser,
      signout: signout
    };

    return services;

    function signin (user, callback) {
      $window.localStorage.setItem('username', user.username);
      $http.post('/users/signin', user)
      .then(function (res) {
        currentUserId = res.data.user;
        $window.localStorage.setItem('userId', currentUserId);
        callback(res.data.token);
      }, function (res) {
        console.log('Sign in error');
        callback(null, true);
      });
    }

    function signup (user, callback) {
      $window.localStorage.setItem('username', user.username);
      $http.post('/users/signup', user)
      .then(function (res) {
        console.log('Signed up!');
        currentUserId = res.data.user;
        $window.localStorage.setItem('userId', currentUserId);
        callback(res.data.token);
      }, function (res) {
        console.log('Error during sign up');
        callback(null, true);
      });
    }

    function isAuth () {
      return !!$window.localStorage.getItem('com.vacaypay');
    }

    function currentUser () {
      console.log(currentUserId,'is ID');
      return currentUserId;
    }

    function signout ($rootScope) {
      $window.localStorage.removeItem('com.vacaypay');
      $window.localStorage.removeItem('userId');
      $window.localStorage.removeItem('username');
      currentUserId = null;
      currentUserName = null;
      $window.location.reload();
      $state.transitionTo('signin');
    }

  }]);
})();