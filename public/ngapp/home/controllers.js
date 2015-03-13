var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$http', '$state',
  function($scope, $http, $state, datasvc) {
  $scope.active = true;
  $scope.hideData = [];
  $scope.Envs = [];

  $http.get('/apps').success(function(data){
    $scope.apps = data;
  });

  $scope.renderEnvPanel = function() {
    $scope.Envs = $scope.selectedApp.Env;
  };
}]);

controllers.controller('EnvCtrl', ['$scope', '$http', 'datasvc',
  function($scope, $http, datasvc) {
    $scope.item = datasvc.currentItem;
  }
]);
