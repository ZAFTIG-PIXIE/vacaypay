(function() {
  'use strict';

  angular.module('app')
 .factory('AddFriend', ['$http', function ($http) {
    var services = {
      inviteFriend: inviteFriend,
      getNotifications: getNotifications
    };

    return services;

    function inviteFriend (data, callback) {
      $http.post('/users/invites', data)
      .then(function(result){
        callback(result.data);
      });
    }

    function getNotifications (data, callback) {
      $http.get('/notificationsEndpoint/' + data.username)
      .then(function(result) {
        callback(result);
      });
    };

    

  }]);
})();