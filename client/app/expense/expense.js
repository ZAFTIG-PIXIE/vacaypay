(function() {
  'use strict';

  angular.module('app')
  .controller('ExpenseController', ['$scope', '$modal', '$cacheFactory', '$timeout', 'Trip', 'AddFriend',
  function ($scope, $modal, $cacheFactory, $timeout, Trip, AddFriend) {

    $scope.data = {};
    $scope.successMessage = false;

    var context = $scope;

    $scope.inviteFriend = function(name, context) {
      $scope.username = "";
      var cache = $cacheFactory.get('tripData');
      var data = {
                  code: cache.get('code'), 
                  user: name
                 };
      AddFriend.inviteFriend(data, function(result){
        console.log('This is the $scope.successMessage from inside inviteFriend:\n', $scope.successMessage);

        $scope.successMessage = true;
        $timeout(function () {
          $scope.successMessage = false;
          console.log('This is the $scope.successMessage from inside inviteFriend:\n', $scope.successMessage);
        }, 3000);
      });

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