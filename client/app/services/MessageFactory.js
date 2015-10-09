(function() {
  'use strict';

  angular.module('app')
 .factory('Message', ['$http', '$window', function ($http) {

    

  function sendMessage(message) {

      return $http.post('/messages/messages', message);



    };


   function getMessages(roomname) {

      return $http.get('/messages/messages/', {

      params: {code: roomname}

    });

      
    };


    var services = {
      sendMessage: sendMessage,
      getMessages: getMessages
     
    };

    return services;




  }]);
})();