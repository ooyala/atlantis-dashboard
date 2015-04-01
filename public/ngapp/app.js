var atlantisApp = angular.module('atlantisApp', [
  'ngAnimate', 'ui.bootstrap', 'ui.router', 'ngSanitize', 'ang-drag-drop',
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
      .state('root', {
        url: '/',
        views: {
         'header': {
            templateUrl: 'ngapp/templates/header.html'
          }
        }
      })
      // dashboard routes
      .state('root.dashboard', {
        url: 'dashboard',
        views: {
          'content@' : {
            templateUrl: 'ngapp/home/templates/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.dashboard.app', {
        url: '/{id:int}',
        views: {
          'body@root.dashboard' : {
            templateUrl: 'ngapp/home/templates/dashboard-body.html',
            controller: 'DashboardBodyCtrl'
          }
        }
      })
      .state('root.dashboard.app.env', {
        url: '/:name',
        views: {
          'body@root.dashboard' : {
            templateUrl: 'ngapp/home/templates/env-content.html',
            controller: 'EnvContentCtrl'
          }
        }
      })
      .state('root.release-wizard', {
        url: 'release-wizard',
        views: {
          'content@' : {
            templateUrl: 'ngapp/release-wizard/templates/release-wizard.html',
            controller: 'ReleaseWizardCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.deploy', {
        url: 'deploy',
        views: {
          'content@' : {
            templateUrl: 'ngapp/deploy/templates/deploy.html',
            controller: 'DeployCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.manage', {
        url: 'manage',
        views: {
          'content@' : {
            templateUrl: 'ngapp/manage/templates/manage.html',
            controller: 'ManageCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.users', {
        url: 'users',
        views: {
          'content@' : {
            templateUrl: 'ngapp/users/templates/users.html',
            controller: 'UsersCtrl',
            controllerAs: 'vm'
          }
        }
      });
  }
]);
