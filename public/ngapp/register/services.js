var services = angular.module('atlantisApp.registerServices', []);

services.factory('supervisorFactory', ['$http', function ($http) {
  var sup = {};

  var callGet = function (url, callback) {
    $http.get(url).success(callback);
  };

  sup.getSupervisors = function (callback) {
    callGet("/supervisors", callback);
  };

  return sup;
}]);

services.factory('managerFactory', ['$http', function ($http) {
  var managers = {};

  var callGet = function (url, callback) {
    $http.get(url).success(callback);
  };

  managers.getManagers = function (callback) {
    callGet("/managers", callback);
  };

  return managers;
}]);

services.factory('routerFactory', ['$http', function ($http) {
  var routers = {};

  var callGet = function (url, callback) {
    $http.get(url).success(callback);
  };

  routers.getRouters = function (callback) {
    callGet("/routers", callback);
  };

  return routers;
}]);

services.factory('ipgrpsFactory', ['$http', function ($http) {
  var IPInfo = {};

  var callGet = function (url, callback) {
    $http.get(url).success(callback);
  };

  var callPut = function (url, data, callback) {
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'},
      User = 'aaaa',
      Secret = 'dummysecret',
      param = 'User=' + User + "&Secret=" + Secret;
    $http.put(url + "?" + param, data, {'headers' : headers}).success(callback);
  };

  var callDelete = function (url, callback) {
    $http.delete(url).success(callback);
  };

  IPInfo.getIPs = function (callback) {
    callGet("/ipgroups", callback);
  };

  IPInfo.getIPInfo = function (grpName, callback) {
    callGet("/ipgroups/" + grpName, callback);
  };

  IPInfo.registerIPGroup = function (grpName, data, callback) {
    callPut("/ipgroups/" + grpName, data, callback);
  };

  IPInfo.deleteIPGroup = function (grpName, callback) {
    callDelete("/ipgroups/" + grpName, callback);
  }

  return IPInfo;
}]);

services.factory('updateIPGroup', ['$modal', '$http', function ($modal, $http) {
  return {
    modalInstance:  function (templateUrl, name, itemType, IPs) {
      return $modal.open({
        templateUrl: templateUrl,
        controller: function ($scope, $modalInstance, name, IPs) {
          $scope.name = name;
          $scope.itemType = itemType;
          $scope.updatedIPs = [];
          $scope.IPs = IPs;

          _.each($scope.IPs, function (val, key) {
            if ($scope.IPs.indexOf(val) === -1) {
              $scope.IPs.push(val);
            }
          });

          $scope.update = function () {
            var url = "/ipgroups/" + $scope.name;
            var headers = {'Content-Type': 'application/x-www-form-urlencoded'},
              User = 'aaaa',
              Secret = 'dummysecret',
              param = 'User=' + User + "&Secret=" + Secret,
              data = {};

            _.each($scope.IPs, function (val, key) {
              $scope.updatedIPs.push(val.text);
            });

            $scope.updatedIPs = $scope.updatedIPs.join(',');
            data = {'IPs' : $scope.updatedIPs};

            $http.put(url + "?" + param, data, {'headers' : headers}).success(function (response) {
              $modalInstance.close(response);
            });
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        resolve: {
          name: function () {
            return name;
          },
          itemType: function () {
            return itemType;
          },
          IPs: function () {
            return IPs;
          }
        }
      });
    }
  };
}]);

services.factory('appsInfoFactory', ['$http', function ($http) {
  var apps = {};

  var callGet = function (url, callback) {
    $http.get(url).success(callback);
  };

  var callPut = function (url, data, callback) {
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'},
      User = 'aaaa',
      Secret = 'dummysecret',
      param = 'User=' + User + "&Secret=" + Secret;
    $http.put(url + "?" + param, data, {'headers' : headers}).success(callback);
  };

  var callDelete = function (url, callback) {
    $http.delete(url).success(callback);
  };

  apps.getApps = function (callback) {
    callGet("/apps", callback);
  };

  apps.getAppInfo = function (appName, callback) {
    callGet("/apps/" + appName, callback);
  };

  apps.registerApp = function (appName, data, callback) {
    callPut("/apps/" + appName, data, callback);
  };

  apps.deleteApp = function (appName, callback) {
    callDelete("/apps/" + appName, callback);
  };

  return apps;
}]);

services.factory('updateApp', ['$modal', '$http', function ($modal, $http) {
  return {
    modalInstance:  function (templateUrl, Name, ItemType, Root, Repo, Email, Internal, NonAtlantis) {
      return $modal.open({
        templateUrl: templateUrl,
        controller: function ($scope, $modalInstance, Name, Root, Repo, Email, Internal, NonAtlantis) {
          $scope.name = Name;
          $scope.itemType = ItemType;
          $scope.root = Root;
          $scope.repo = Repo;
          $scope.email = Email;
          $scope.data = {};
          $scope.internal = Internal;
          $scope.non_atlantis = NonAtlantis;

          $scope.update = function (Name, Root, Repo, Email, Internal, NonAtlantis) {
            $scope.data = {Name, Root, Repo, Email, Internal, NonAtlantis};
            var url = "/apps/" + $scope.data.Name;

            $http.post(url, $scope.data).success(function(data){
              $modalInstance.close(data);
            });
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        resolve: {
          Name: function () {
            return Name;
          },
          ItemType: function () {
            return ItemType;
          },
          Root: function () {
            return Root;
          },
          Repo: function () {
            return Repo;
          },
          Email: function () {
            return Email;
          },
          Internal: function () {
            return Internal;
          },
          NonAtlantis: function () {
            return NonAtlantis;
          }
        }
      });
    }
  }
}]);
