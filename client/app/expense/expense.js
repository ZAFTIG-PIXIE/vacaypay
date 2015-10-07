(function() {
  'use strict';

  angular.module('app')
  .controller('ExpenseController', ['$scope', '$modal', '$cacheFactory', 'Trip', 'AddFriend',
  function ($scope, $modal, $cacheFactory, Trip, AddFriend) {

    $scope.data = {};

    $scope.inviteFriend = function(name) {
      console.log('This is the name passed inot inviteFriend: ', name);
      $scope.addFriend = "";
      console.log('This is this:\n', this);
      var data = {
                  user:name
                 };
      AddFriend.inviteFriend(data, function(result){
        console.log(result);
      })

    };

    $scope.getExpenses = function() {
      // The trip data cache has not been set yet so need to call has trip here for now...
      Trip.hasTrip(function(data) {
        Trip.cacheTrip(data);
        var cache = $cacheFactory.get('tripData');
        $scope.data.expenses = cache.get('expenses');
      });
    };

    
    $scope.getExpenses();

    $scope.open = function() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/createExpense/createExpense.html',
        controller: 'CreateExpenseController'
      });

      modalInstance.result.then(function(expenses) {
        $scope.data.expenses = expenses;
      });
    };
  }])
  
  .controller('ExpenseAccordionController', ['$scope', function ($scope) {
    $scope.oneAtATime = false;
  }]);
})();