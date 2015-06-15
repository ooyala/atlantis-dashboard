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

services.factory('routerFactory', ['$http', function($http){
  var routers = {};

  var callGet = function(url, callback) {
    $http.get(url).success(callback);
  };

  routers.getRouters = function(callback){
    callGet("/routers",callback);
  };

  return routers;
}]);

services.factory('ipgrpsFactory', ['$http', function($http){
  var IPInfo = {};

  var callGet = function(url, callback) {
    $http.get(url).success(callback);
  };

  IPInfo.getIPInfo = function(callback){
    callGet("/ipgroups",callback);
  };

  return IPInfo;
}]);

services.factory('updateIPGroup', ['$modal', function($modal){
  return {
    modalInstance:  function(templateUrl, name, itemType, IPs) {
      return $modal.open({
        templateUrl: templateUrl,
        controller: function ($scope, $modalInstance, name, IPs) {
          $scope.name = name;
          $scope.itemType = itemType;
          $scope.IPs = IPs;

          $scope.update = function () {
            $modalInstance.close(name);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        resolve: {
          name: function() {
            return name;
          },
          itemType: function() {
            return itemType;
          },
          IPs: function() {
            return IPs;
          }
        }
      });
    }
  }
}]);

