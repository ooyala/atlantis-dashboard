var directives = angular.module('atlantisApp.homeDirectives', []);

directives.directive("envDepedency", function() {
  return {
    templateUrl : 'ngapp/templates/dependencies.html',
    controller: ["$scope", 'appsFactory', function($scope, appsFactory) {
      appsFactory.currentEnv = $scope.env;
    }],
  };
});
