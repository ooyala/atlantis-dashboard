var controllers = angular.module('atlantisApp.manageControllers', []);

controllers.controller('ManageCtrl', ['$scope', '$rootScope', '$state',
  function ($scope, $rootScope, $state) {
    $rootScope.title = $state.current.title;
  }]);
