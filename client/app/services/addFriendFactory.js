(function() {
  'use strict';

  angular.module('app')
 .factory('AddFriend', ['$http', function ($http) {
    var services = {
      inviteFriend: inviteFriend,
      getInvites: getInvites
    };

    return services;

    function inviteFriend (data, callback) {
      $http.post('/users/invites', data)
      .then(function(result){
        callback(result.data);
      });
    };

    function getInvites (data, callback) {
      console.log('This is the data passed into getInvites:\n', data);
      $http.get('/users/invites/' + data.username)
      .then(function(result) {
        console.log("result from AddFriend factory")
        callback(result);
      });
    };

    

  }]);
})();