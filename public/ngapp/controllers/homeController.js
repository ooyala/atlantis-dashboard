var myApp = angular.module('myApp', ['ui.router']);//, 'underscore']);

myApp.factory('datasvc', function(){
  var svc = {};
  svc.getData = function(item){
    var data = item;
    return data;
  }
  return svc;
});

myApp.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http, datasvc) {
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


myApp.controller('EnvCtrl', ['$scope', '$http', 'datasvc',
  function($scope, $http, datasvc) {
    $scope.item = datasvc.currentItem;
  }
]);

myApp.directive("myEnv", function() {
  return {
    templateUrl : 'templates/env-template.html',
    controller: ["$scope", 'datasvc', function($scope, datasvc) {
      $scope.panel = true;
      datasvc.currentItem = $scope.item;
    }],
  };
});

myApp.config(["$stateProvider", "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('dashboardState');
    $stateProvider.state('envState',{
      url : '/environment',
      controller : 'EnvCtrl',
      templateUrl : 'environment.html'
    }).state('dashboardState',{
      url : '/dashboard',
      controller : 'DashboardCtrl',
      templateUrl : 'dashboard.html'
    });
  }
]);

// filters
myApp.filter("titleize", function() {
  return function(str) {
    if(str) {
      var i, words, updated_words = [];
      str = str.replace(/_/g, ' ');
      words = str.split(' ');
      for (i=0; i<words.length; ++i) {
        updated_words.push(words[i].charAt(0).toUpperCase() + words[i].slice(1));
      }
      return updated_words.join(' ');
    }
    return '';
  };
});
