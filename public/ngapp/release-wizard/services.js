var services = angular.module('atlantisApp.releaseWizardServices', []);

services.factory('appInfoModal', ['$modal', function ($modal) {
  return {
    modalInstance:  function (templateUrl, appInfo) {
      return $modal.open({
        templateUrl: templateUrl,

        controller: function ($scope, $modalInstance, app) {
          $scope.app = app;

          $scope.ok = function () {
            $modalInstance.close(name);
          };
        },
        resolve: {
          app: function () {
            return appInfo;
          }
        }
      });
    }
  };
}]);
