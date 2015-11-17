var directives = angular.module('atlantisApp.commonDirectives', []);

directives.directive('disableNavigation', ["$document", function ($document) {
  return {
    restrict: 'AE',
    scope: {//create isolate scope so that locationChangeStart get destroyed for this modal
    //otherwise we will end up same event getting fired twice on two different location
    },
    link: function (scope, element, attr) {
      scope.currentUrl = $document[0].URL;
      scope.$on("$locationChangeStart", locationChange);
      function locationChange(event, next, current) {
        if (next !== scope.currentUrl) {
        event.preventDefault();
        }
      }
    }
  };
}]);
