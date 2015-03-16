var directives = angular.module('atlantisApp.homeDirectives', []);

directives.directive("myEnv", function() {
  return {
    templateUrl : 'ngapp/templates/env-template.html',
    controller: ["$scope", 'datasvc', function($scope, datasvc) {
      $scope.panel = true;
      datasvc.currentItem = $scope.item;
      datasvc.selectedApp = $scope.selectedApp;
      datasvc.apps = $scope.apps;
    }],
  };
});

directives.directive("envDepedency", function() {
  return {
    templateUrl : 'ngapp/templates/dependencies.html',
    controller: ["$scope", 'datasvc', function($scope, datasvc) {
      datasvc.currentItem = $scope.item;
    }],
  };
});
