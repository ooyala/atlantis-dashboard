var services = angular.module('atlantisApp.homeServices', []);

services.factory('datasvc', ['$http', function($http){
  var svc = {}, apps, selectedApp;

  svc.loadApps = function(data){
    apps = data;
  };

  svc.setSelectedApp = function(app){
    selectedApp = app;
  };

  svc.getSelectedApp = function(){
    return selectedApp;
  };

  svc.allApps = function() {
    return apps;
  };
  return svc;
}]);
