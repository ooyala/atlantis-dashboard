var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$http', '$state', 'appsFactory',
  function($scope, $http, $state, appsFactory) {

  $scope.envs = [];
  $scope.isEnvEnable = false;
  $scope.envBtnText  = $scope.appBtnText = "Choose here";
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
    $scope.app = app;
    $scope.$parent.appBtnText = app.Name;
    $scope.$parent.envBtnText = "Choose here";        // reset
    $scope.$parent.envs = app.Envs;
    $scope.$parent.isEnvEnable = true;
  })

}]);

controllers.controller('EnvContentCtrl', ['$scope', '$stateParams', 'appsFactory',
  function ($scope, $stateParams, appsFactory) {

  console.log('in EnvContentCtrl');
  $scope.$parent.envBtnText = $stateParams.name;
  appsFactory.findEnv($stateParams.id, $stateParams.name, function(env) {
    $scope.env = env;
  })
}]);


// controllers.controller('EnvCtrl', ['$scope', '$http', 'appsFactory',
//   function($scope, $http, appsFactory) {
//     $scope.item = appsFactory.currentEnv;
//     $scope.apps = appsFactory.allApps();
//     $scope.selected = appsFactory.getSelectedApp();
//     $scope.envs = $scope.selected.Envs;
//     $scope.selectedEnv = appsFactory.currentEnv
//   }
// ]);
