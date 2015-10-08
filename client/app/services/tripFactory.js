(function() {
  'use strict';
  angular.module('app')
  .factory('Trip', ['$http', '$cacheFactory', '$window', 'Auth', 
  function ($http, $cacheFactory, $window, Auth) {

    var currentUser = $window.localStorage.getItem('userId');
    var username = $window.localStorage.getItem('username');
    var cache = $cacheFactory('tripData');
    // var currentTripData;

    var services = {
      createTrip: createTrip,
      cacheTrip: cacheTrip,
      joinTrip: joinTrip,
      getRecentTrip: getRecentTrip,
      hasTrip: hasTrip,
      endTrip: endTrip

    };

    return services;

    function createTrip(trip, callback) {
      $http.post('/trips', {
        id: currentUser,
        name: trip.name,
        code: trip.code
      })
      .then(function (res) {
        // currentTripData = res.data;
        cacheTrip(res.data);
        callback();
      });
    }

    function joinTrip(code, invited, callback, user) {
      var user = user || $window.localStorage.getItem('userId');
      var endPoint;
      invited ? endPoint = 'approve' : endPoint = 'join';
      console.log('This is our endpoint: ', endPoint);
      $http.post('/trips/' + endPoint, {
        id: user, //change this dynamically when accepting invite// if user is provided take it if not take lS
        code: code
      })
      .then(function(res) {
        console.log('This is res.data:\n', res.data);
        cacheTrip(res.data);
        if(callback){
          callback(invited);
        }
      });
    }

    function cacheTrip (trip) {
      cache.put('_id', trip.id);
      cache.put('creator', trip.creator);
      cache.put('participants', trip.participants);
      cache.put('name', trip.name);
      cache.put('code', trip.code);
      cache.put('expenses', trip.expenses);
      return cache;
    }

    function hasTrip(callback) {
      $http.get('/trips', {
        params: { id: currentUser }
      })
      .then( function (res) {
        cacheTrip(res.data);
        callback(res.data);
      });
    }

    function getRecentTrip(callback) {
      $http.get('/trips/recent', {
        params: {
          id: currentUser,
          username: username
        }
      })
      .then(function(res) {
        // Should return an array of only one trip, so we want to pull it out.
        callback(res.data);
      });
    }

    function endTrip(resultObj, callback) {
      $http.post('/trips/end', resultObj)
      .then(function (res) {
        callback();
      });
    }
  }]);
})();
