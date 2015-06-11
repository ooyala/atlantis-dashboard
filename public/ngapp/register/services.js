var services = angular.module('atlantisApp.registerServices', []);

services.factory('supervisorFactory', ['$http', function($http){
  var sup = {};

  var callGet = function(url, callback) {
    $http.get(url).success(callback);
  };

  sup.getSupervisors = function(callback){
    callGet("/supervisors",callback);
  };

  return sup;
}]);

services.factory('managerFactory', ['$http', function($http){
  var managers = {};

  var callGet = function(url, callback) {
    $http.get(url).success(callback);
  };

  managers.getManagers = function(callback){
    callGet("/managers",callback);
  };

  return managers;
}]);
