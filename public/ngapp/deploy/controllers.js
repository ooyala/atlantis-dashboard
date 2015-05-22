var controllers = angular.module('atlantisApp.deployControllers', []);

controllers.controller('DeployCtrl', ['$scope', '$rootScope', '$state',
  function($scope, $rootScope, $state) {

  $rootScope.title = $state.current.title;
}]);
