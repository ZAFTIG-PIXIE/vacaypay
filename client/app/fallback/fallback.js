(function() {
  'use strict';

  angular.module('app')
  .controller('FallbackController', ['$scope', '$http', '$modal', '$state', '$window', '$timeout', 'Trip', 'Auth', 'AddFriend',
  function ($scope, $http, $modal, $state, $window, $timeout, Trip, Auth, AddFriend) {

    $scope.tripCode = '';
    $scope.inviteCode = '';
    $scope.inviteCreator = '';
    $scope.inviteTripName = '';
    $scope.recentTrip;
    $scope.totalExpenses;
    $scope.hasRecentTrip = false;
    $scope.joinTripRequestSent = false;
    $scope.username = $window.localStorage.getItem('username');

    var venmoRedirect = 'https://api.venmo.com/v1/oauth/authorize?client_id=2977&scope=access_profile&response_type=code&redirect_uri=http://localhost:8443/oauth?user=' + $scope.username;
    
    $scope.sendToVenmo = function () {
      $window.location.href = venmoRedirect;
    };

    $scope.logout = function() {
      Auth.signout();
    };

    $scope.open = function() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/createTrip/createTrip.html',
        controller: 'CreateTripController'
      });
    };

    $scope.joinTrip = function(code, invited) {
      $scope.tripCode = "";
      Trip.joinTrip(code, invited, function(invited) {
         //only if creator accepted request in case of selfinvitation
        if(invited){
          $state.transitionTo('currentTrip.expense');
        } else {
          $scope.joinTripRequestSent = true;
          $timeout(function () {
            $scope.joinTripRequestSent = false;
          }, 3000); 
        }
      });
    };

    $scope.hasTrip = function () {
      Trip.hasTrip( function (data, option) {
        $scope.data = data;
        console.log("This object's .name property must be truthy in order to go to currentTrip view: ", $scope.data);
        $scope.data.participants.forEach(function(participant) {
          if (participant.username === $scope.username) {
            $state.transitionTo('currentTrip.expense');
          }
        });
        
      });
    };

    $scope.getRecentTrip = function () {
      Trip.getRecentTrip(function (mostRecentTrip) {
        if (mostRecentTrip) {
          $scope.recentTrip = mostRecentTrip;
          totalExpenses();
          $scope.hasRecentTrip = true;
        }
      });
    };

    $scope.getInvites = function () {
      // Set interval for notifications update
      console.log("invites called");
      var data = {};
      data.username = $scope.username;
      console.log(data);
      AddFriend.getInvites(data, function (results) {
        console.log('These are the results:\n', results);
        $scope.inviteCode = results.data.data[0].code;
        $scope.inviteCreator = results.data.data[0].creator.username;
        $scope.inviteTripName = results.data.data[0].name;
      });
    };

    var totalExpenses = function() {
      $scope.totalExpenses =  $scope.recentTrip.expenses.reduce(function(total, current) {
        return total + parseInt(current.amount);
      }, 0);
    };

    $scope.hasTrip();
    $scope.getRecentTrip();
    $scope.getInvites();
  }]);
})();
