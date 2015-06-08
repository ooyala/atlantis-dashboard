var services = angular.module('atlantisApp.homeServices', []);

services.factory('appsFactory', ['$http', function($http){
  var selectedApp, svc = {
    apps: []
  };

  var callGet = function(url, callback) {
    $http.get(url).success(callback);
  };

  var callPost = function(url, postData, success, error) {
    $http.post(url, postData).success(success).error(error);
  };

  var getApps = function(callback){
    callGet('/apps', callback);
  }

  svc.list = getApps;

  svc.findByName = function(name, callback) {
    callGet('/apps/' + name, callback);
  };

  svc.getEnvs = function(callback) {
    callGet('/envs', callback);
  };

  svc.getEnvsByApp = function(appName, callback) {
  };

  svc.deployApp = function(options, success, error) {
    var buildUrl = '/instances/apps/' + options.appName + '/shas/' +
                    options.sha + '/envs/' + options.env +
                    '/containers?User=aa&Secret=dummysecret';

    callPost(buildUrl, options.data, success, error);
  };

  svc.getTasks = function(id, success, error) {
    callGet('/tasks/' + id, success, error);
  };

  svc.findEnv = function(appName, envName, callback) {
    callGet('/apps/' + appName + '/envs/' + envName, callback);
  };

  svc.getContainer = function(containerID, callback){
    callGet('/instance_data/' + containerID, callback)
  };

  svc.getShaById = function(id, callback){
    callGet('/shas/'+id, callback);
  };

  svc.getDeps = function(callback) {
    callGet('/deps', callback);
  };

  return svc;
}]);

services.factory('deleteModal', ['$modal', function($modal){
  return {
    modalInstance:  function(templateUrl, name, type, itemType) {
      return $modal.open({
        templateUrl: templateUrl,
        controller: function ($scope, $modalInstance, name) {
          $scope.confirmName = '';
          $scope.type = type;
          $scope.name = name;
          $scope.itemType = itemType;
          $scope.headerText = "<h5>Please type in the "+type+" <b>"+name+"</b> to confirm.</h5>";

          $scope.ok = function () {
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
          type: function() {
            return type;
          },
          itemType: function() {
            return itemType;
          }
        }
      });
    }
  }
}]);
