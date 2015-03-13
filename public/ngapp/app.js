var atlantisApp = angular.module('atlantisApp', [
  'ui.router', 'atlantisApp.homeControllers', 'atlantisApp.homeDirectives',
  'atlantisApp.homeServices', 'atlantisApp.filters'
]);

atlantisApp.config(["$stateProvider", "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('dashboard');
    $stateProvider.state('envState',{
      url : '/environment',
      controller : 'EnvCtrl',
      templateUrl : 'ngapp/templates/env_content.html'
    }).state('dashboardState',{
      url : '/dashboard',
      controller : 'DashboardCtrl',
      templateUrl : 'ngapp/templates/dashboard.html'
    });
  }
]);
