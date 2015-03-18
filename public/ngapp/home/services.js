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

  return svc;
}]);
