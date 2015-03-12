var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http, datasvc) {
  $scope.active = true;
  $scope.hideData = [];
  $scope.Envs = [];

  $http.get('/apps').success(function(data){
    $scope.App = data;
  });

  $scope.$watch('selectedApp', function(app) {
    if (app) {
      $scope.Envs = app.Env;
    }
  });
}]);

controllers.controller('EnvCtrl', ['$scope', '$http', 'datasvc',
  function($scope, $http, datasvc) {
    $scope.item = datasvc.currentItem;
  }
]);
