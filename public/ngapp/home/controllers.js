var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$http', '$state', 'datasvc',
  function($scope, $http, $state, datasvc) {
  $scope.Envs = [];

  $scope.renderEnvPanel = function(app) {
    datasvc.setSelectedApp(app.value);
    $scope.Envs = app.value.Envs;
  };
}]);

controllers.controller('DropdownCtrl', ['$scope', 'datasvc', function ($scope, datasvc) {
  $scope.apps = datasvc.apps;

  $scope.btnText = "Choose here";
  $scope.status = {
    isopen: false
  };

  $scope.chooseOption = function(app) {
    $scope.btnText = app.Name;
  }
}]);

controllers.controller('EnvCtrl', ['$scope', '$http', 'datasvc',
  function($scope, $http, datasvc) {
    $scope.item = datasvc.currentEnv;
    $scope.apps = datasvc.allApps();
    $scope.selected = datasvc.getSelectedApp();
    $scope.envs = $scope.selected.Envs;
    $scope.selectedEnv = datasvc.currentEnv
  }
]);
