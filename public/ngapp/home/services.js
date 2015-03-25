var services = angular.module('atlantisApp.homeServices', []);

services.factory('appsFactory', ['$http', function($http){
  var selectedApp, svc = {
    apps: []
  };

  var getApps = function(callback){
    $http.get('/apps', { cache: true }).success(callback);
  }

  svc.list = getApps;

  svc.findById = function(id, callback) {
    getApps(function(apps) {
      var app = apps.filter(function(app){
        return app.Id === id;
      })[0];
      callback(app);
    });
  };

  svc.findEnv = function(id, envName, callback) {
    var env = {}
    this.findById(id, function(app) {
      var env = app.Envs.filter(function(env){
        return env.Name === envName;
      })[0];
      callback(env, app);
    })
  };

  svc.getShaById = function(id, callback){
    $http.get('/shas/'+id, { cache: true }).success(callback);
  };

  svc.getDeps = function(callback) {
    $http.get('/deps', { cache: true }).success(callback);
  };

  return svc;
}]);
