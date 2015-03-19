var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$http', '$state', 'appsFactory',
  function($scope, $http, $state, appsFactory) {

  $scope.envs = [];
  $scope.isEnvEnable = false;
  $scope.envBtnText  = $scope.appBtnText = "Choose here";
  $scope.headerTitle = "Environment Configuration And Management";
  $scope.appStatus = {
    isopen: false
  };
  $scope.envStatus = {
    isopen: false
  };

  appsFactory.list(function(data) {
    $scope.apps = data;
  });
}]);

controllers.controller('DashboardBodyCtrl', ['$scope', '$stateParams', 'appsFactory',
  function ($scope, $stateParams, appsFactory) {

  appsFactory.findById($stateParams.id, function(app){
    $scope.$parent.isEnvEnable = false;
    $scope.app = app;
    $scope.$parent.appBtnText = app.Name;
    $scope.envs = app.Envs;
    $scope.$parent.envBtnText = "Choose here";        // reset
    $scope.$parent.envs = app.Envs;
  })
}]);

controllers.controller('EnvContentCtrl', ['$scope', '$stateParams', 'appsFactory',
  function ($scope, $stateParams, appsFactory) {

  console.log('in EnvContentCtrl');
  $scope.$parent.envBtnText = $stateParams.name;
  $scope.$parent.isEnvEnable = true;
  $scope.$parent.headerTitle = "Environment Detail / Container Management";
  appsFactory.findEnv($stateParams.id, $stateParams.name, function(env, app) {
    $scope.$parent.appBtnText = app.Name;
    $scope.$parent.envs = app.Envs;
    $scope.env = env;
  })
}]);
