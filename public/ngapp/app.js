var atlantisApp = angular.module('atlantisApp', [
  'ngAnimate', 'ui.bootstrap', 'ui.router',
  'atlantisApp.homeControllers', 'atlantisApp.releaseWizardControllers',
  'atlantisApp.deployControllers', 'atlantisApp.manageControllers',
  'atlantisApp.usersControllers',
  'atlantisApp.homeDirectives',
  'atlantisApp.homeServices',
  'atlantisApp.filters'
]);

atlantisApp.config(["$stateProvider", "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('app', {
        url: '/',
        views: {
         'header': {
            templateUrl: 'ngapp/templates/header.html'
          }
        }
      })
      .state('app.dashboard', {
        url: 'dashboard',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.release-wizard', {
        url: 'dashboard',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/release-wizard.html',
            controller: 'ReleaseWizardCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.deploy', {
        url: 'deploy',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/deploy.html',
            controller: 'DeployCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.manage', {
        url: 'manage',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/manage.html',
            controller: 'ManageCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.users', {
        url: 'users',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/users.html',
            controller: 'UsersCtrl',
            controllerAs: 'vm'
          }
        }
      });
      // .state('envState',{
      //   url : '/environment',
      //   controller : 'EnvCtrl',
      //   templateUrl : 'ngapp/templates/env_content.html'
      // })
      // .state('dashboardState',{
      //   url : '/dashboard',
      //   controller : 'DashboardCtrl',
      //   templateUrl : 'ngapp/templates/dashboard.html'
      // });
  }
]);
