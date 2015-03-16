var directives = angular.module('atlantisApp.homeDirectives', []);

directives.directive("myEnv", function() {
  return {
    templateUrl : 'ngapp/templates/env-template.html'
  };
});

directives.directive("envDepedency", function() {
  return {
    templateUrl : 'ngapp/templates/dependencies.html',
    controller: ["$scope", 'datasvc', function($scope, datasvc) {
      datasvc.currentEnv = $scope.item;
    }],
  };
});
