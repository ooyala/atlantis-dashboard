var directives = angular.module('atlantisApp.homeDirectives', []);

directives.directive("myEnv", function() {
  return {
    templateUrl : 'ngapp/templates/env-template.html',
    controller: ["$scope", 'datasvc', function($scope, datasvc) {
      $scope.panel = true;
      datasvc.currentItem = $scope.item;
    }],
  };
});
