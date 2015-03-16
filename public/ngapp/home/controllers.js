var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$http', '$state', 'datasvc',
  function($scope, $http, $state, datasvc) {
  $scope.active = true;
  $scope.hideData = [];
  $scope.Envs = [];

  $http.get('/apps').success(function(data){
    $scope.apps = data;
    datasvc.loadApps(data);
  });

  $scope.renderEnvPanel = function(app) {
    datasvc.setSelectedApp(app.value);
    $scope.Envs = app.value.Env;
  };
}]);

controllers.controller('EnvCtrl', ['$scope', '$http', 'datasvc',
  function($scope, $http, datasvc) {
    $scope.item = datasvc.currentEnv;
    $scope.apps = datasvc.allApps();
    $scope.selected = datasvc.getSelectedApp();
  }
]);
