(function() {
  'use strict';

  angular.module('app')
 .factory('AddFriend', ['$http', function ($http) {
    var services = {
      inviteFriend: inviteFriend
    };

    return services;

    function inviteFriend (data, callback) {
      $http.post('/users/invites', data)
      .then(function(result){
        callback(result.data);
      });
    }

    

  }]);
})();