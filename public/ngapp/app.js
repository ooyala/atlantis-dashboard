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
            templateUrl: 'ngapp/templates/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.dashboard.app', {
        url: '/{id:int}',
        views: {
          'body@root.dashboard' : {
            templateUrl: 'ngapp/templates/dashboard-body.html',
            controller: 'DashboardBodyCtrl'
          }
        }
      })
      .state('root.dashboard.app.env', {
        url: '/:name',
        views: {
          'body@root.dashboard' : {
            templateUrl: 'ngapp/templates/env-content.html',
            controller: 'EnvContentCtrl'
          }
        }
      })
      // .state('root.dashboard.app.dep', {
      //   url: '/:name',
      //   views: {
      //     'body@root.dashboard' : {
      //       templateUrl: 'ngapp/templates/env-content.html',
      //       controller: 'EnvContentCtrl'
      //     }
      //   }
      // })
      // release wizard routes
      .state('root.release-wizard', {
        url: 'dashboard',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/release-wizard.html',
            controller: 'ReleaseWizardCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.deploy', {
        url: 'deploy',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/deploy.html',
            controller: 'DeployCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.manage', {
        url: 'manage',
        views: {
          'content@' : {
            templateUrl: 'ngapp/templates/manage.html',
            controller: 'ManageCtrl',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.users', {
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
