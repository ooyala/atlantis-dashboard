var atlantisApp = angular.module('atlantisApp', [
  'ngAnimate', 'ui.bootstrap', 'ui.router', 'ngSanitize', 'ang-drag-drop',
  'atlantisApp.homeControllers', 'atlantisApp.releaseWizardControllers',
  'atlantisApp.deployControllers', 'atlantisApp.manageControllers',
  'atlantisApp.usersControllers',
  'atlantisApp.homeDirectives',
  'atlantisApp.homeServices',
  'atlantisApp.filters'
], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});

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
        url: '/:appName',
        views: {
          'body@root.dashboard' : {
            templateUrl: 'ngapp/home/templates/dashboard-body.html',
            controller: 'DashboardBodyCtrl'
          }
        }
      })
      .state('root.dashboard.app.env', {
        url: '/:envName',
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
