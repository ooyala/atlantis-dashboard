var controllers = angular.module('atlantisApp.usersControllers', []);

controllers.controller('UsersCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  $rootScope.title = $state.current.title;
}]);
