(function() {
  'use strict';

  angular.module('app')
  .controller('CreateExpenseController', ['$scope', '$rootScope', '$window', '$modalInstance', '$state', '$cacheFactory', 'Expenses', 'Auth',
  function ($scope, $rootScope, $window, $modalInstance, $state, $cacheFactory, Expenses, Auth) {
    var cache = $cacheFactory.get('tripData');

    $scope.expense = {};
    var participants = cache.get('participants');
    var creatorId = $window.localStorage.getItem('userId');
    var creatorUsername = $window.localStorage.getItem('username');

    // Participants is mapped to format it in a way that the dropdown menu can understand.
    $scope.participants = participants.map(function(participant) {
      return { id: participant.id, label: participant.username };
    });

    // $scope.stakeholders is the model that the dropdown menu creates.
    $scope.stakeholders = [{id: creatorId, label: creatorUsername}];

    // Configures the dropdown menu
    // http://dotansimha.github.io/angularjs-dropdown-multiselect/#/
    $scope.dropdownSettings = {
      smartButtonMaxItems: 5,
      scrollableHeight: '200px',
      scrollable: true,
      externalIdProp: '',
    };

    $scope.buttonText = {
      buttonDefaultText: 'Select Contributors'
    };



    // $scope.addNote = function() {

    //   var notification = {};
    //   notification.code = $window.localStorage.getItem('code');

    //   //so we are passing in a notification object, that has the amount and the name of the expense in it
    //   //opertion on the server when get notifications triggers
    //   //-> get code -> nofifications.find({code: code}).exec(function(err, result) {
    //     //this will be an array of objects that have the current notifications inside of them
    //     //next step will be to remove the ones where the current username equals the payername and return all the rest in the rigt format
    //     //also select only the ones that have not been viewed yet -> after viewing set viewed int to 1 and dont select them any more
    //     //-> output: "simon" paid for "shushi" for an amount of "100 dollars"
    //     //making get request in interval when soemthing is been found make it clickable in the navbar


    //     //})

    //   notification.expense = {
    //     amount : $scope.expense.amount;
    //     name : $scope.expense.name;
    //     payer : $window.localStorage.getItem('payer');

    //   };

    //   Notify.addNotification(notification)
    //   .then(function() {
    //     console.log("sucsess");
    //   })
    //   .catch(function(error) {
    //     console.error("error");
    //   })

    // };






    $scope.addExpense = function () {
      // If the stakeholders model is empty add the creator to the model
      if(!$scope.stakeholders.length) {
        $scope.stakeholders = [{id: creatorId, label: creatorUsername}];
      }

      // Return the data back to the server in the correct format
      $scope.stakeholders = $scope.stakeholders.map(function(stakeholder) {
        return { id: stakeholder.id, username: stakeholder.label };
      });
      Expenses.addExpense($scope.expense, $scope.stakeholders, function (tripData) {
        console.log('expense added');
        $modalInstance.close(tripData.expenses);
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
})();