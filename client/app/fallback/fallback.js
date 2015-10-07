(function() {
  'use strict';

  angular.module('app')
  .controller('FallbackController', ['$scope', '$http', '$modal', '$state', '$window', 'Trip', 'Auth', 'AddFriend',
  function ($scope, $http, $modal, $state, $window, Trip, Auth, AddFriend) {

    $scope.tripCode = '';
    $scope.recentTrip;
    $scope.totalExpenses;
    $scope.hasRecentTrip = false;
    $scope.username = $window.localStorage.getItem('username');
    $scope.dummy = ['Hi', 'Simon', 'OhNo', 'It\'s Backbone!'];

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

    $scope.joinTrip = function() {
      Trip.joinTrip($scope.tripCode, function() {
        $state.transitionTo('currentTrip.expense');
      });
    };

    $scope.hasTrip = function () {
      Trip.hasTrip( function (data) {
        $scope.data = data;
        if ($scope.data.name) {
          $state.transitionTo('currentTrip.expense');
        }
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

    $scope.getNotifications = function () {
      // Set interval for notifications update
      var data = {};
      data.username = $scope.username;
      console.log(data);
      AddFriend.getNotifications(data, function (results) {
        console.log('These are the results:\n', results);
        // push the results into dummy array so it can be included in the DOM on update
      });
    };

    var totalExpenses = function() {
      $scope.totalExpenses =  $scope.recentTrip.expenses.reduce(function(total, current) {
        return total + parseInt(current.amount);
      }, 0);
    };

    $scope.hasTrip();
    $scope.getRecentTrip();
    $scope.getNotifications();
  }]);
})();
