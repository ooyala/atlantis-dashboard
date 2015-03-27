var directives = angular.module('atlantisApp.homeDirectives', []);

directives.directive("envDependency", function() {
  return {
    templateUrl : 'ngapp/templates/dependencies.html',
    controller: ['$scope', '$modal', 'appsFactory', function($scope, $modal, appsFactory) {
      $scope.hover = function(dep) {
        return dep.showFlag = !dep.showFlag;
      };

      $scope.unregisterDependency = function(dep) {
        var modalInstance = $modal.open({
          templateUrl: 'ngapp/templates/deleteModal.html',
          controller: function ($scope, $modalInstance, name) {
            $scope.confirmName = '';
            $scope.type = 'dependency name';
            $scope.itemType = 'dependency';
            $scope.name = name;
            $scope.ok = function () {
              $modalInstance.close(name);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          },
          resolve: {
            name: function() {
              return dep.Name;
            }
          }
        });

        modalInstance.result.then(function(name) {
          $scope.deps = _.filter($scope.deps, function(dep) {
            return dep.Name !== name;
          })
          $scope.addAlert({
            type: 'success', message: "Dependency '" + name + "' unregistered successfully.",
            icon: 'glyphicon glyphicon-ok'
          });
        }, function(result) {
          console.log(result);
        });
      };
    }],
  };
});
