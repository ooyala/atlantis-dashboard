var services = angular.module('atlantisApp.registerServices', []);

// ------------ Factories ---------------
services.factory('supervisorFactory', ['$http', function ($http) {
  var sup = {};

  sup.getSupervisors = function (callback) {
    $http.get("/supervisors").success(callback);
  };

  sup.registerSupervisor = function (host, callback) {
    var options = {
          'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
        }, User = 'aaaa', Secret = 'dummysecret', data = {User, Secret};

    $http.put("/supervisors/" + host, data, options).success(callback);
  };

  sup.getSupervisorStatus = function (id, callback) {
    $http.get("/tasks/" + id).success(callback);
  };

  sup.deleteSupervisor = function (name, callback) {
    $http.delete("/supervisors/" + name).success(callback);
  };

  return sup;
}]);

services.factory('managerFactory', ['$http', function ($http) {
  var managers = {};

  managers.getManagers = function (callback) {
    $http.get("/managers").success(callback);
  };

  managers.addManager = function (region, host, data, callback) {
    var options = {
      'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
    }, urlSuffix = region + '/' + host + '?User=aa&Secret=dummysecret';

    $http.put("/managers/" + urlSuffix, data, options).success(callback);
  };

  managers.getTaskStatus = function (id, callback) {
    $http.get("/tasks/" + id).success(callback);
  };

  return managers;
}]);

services.factory('routerFactory', ['$http', function ($http) {
  var routers = {};

  routers.getRouters = function (options, callback) {
    $http.get("/routers", { params: options }).success(callback);
  };

  routers.registerRouter = function (routerName, data, callback) {
    var options = {
      'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
    }, urlSuffix = data.Zone + '/' + routerName + '?User=aa&Secret=dummysecret';

    $http.put("/routers/" + urlSuffix, data, options).success(callback);
  };

  routers.deleteRouter = function (options, callback) {
    var urlSuffix = options.Zone + '/' + options.Host +
        '?User=' + options.User + '&Secret=' + options.Secret +
        '&Internal=' + options.Internal;

    $http.delete("/routers/" + urlSuffix).success(callback);
  };

  routers.getTaskStatus = function (id, callback) {
    $http.get("/tasks/" + id).success(callback);
  };

  return routers;
}]);

services.factory('ipgrpsFactory', ['$http', function ($http) {
  var IPInfo = {};

  IPInfo.getIPs = function (callback) {
    $http.get("/ipgroups").success(callback);
  };

  IPInfo.getIPInfo = function (grpName, callback) {
    $http.get("/ipgroups/" + grpName).success(callback);
  };

  IPInfo.registerIPGroup = function (grpName, data, callback) {
    var options = {
      'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, User = 'aa', Secret = 'dummysecret',
    param = 'User=' + User + "&Secret=" + Secret;

    $http.put("/ipgroups/" + grpName + '?' + param, data, options).success(callback);
  };

  IPInfo.deleteIPGroup = function (grpName, callback) {
    $http.delete("/ipgroups/" + grpName).success(callback);
  }

  return IPInfo;
}]);

services.factory('appsInfoFactory', ['$http', function ($http) {
  var apps = {};

  apps.getApps = function (callback) {
    $http.get("/apps").success(callback);
  };

  apps.getAppInfo = function (appName, callback) {
    $http.get("/apps/" + appName).success(callback);
  };

  apps.registerApp = function (appName, data, callback) {
    var options = {
      'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, User = 'aa', Secret = 'dummysecret',
    param = 'User=' + User + "&Secret=" + Secret;

    $http.put("/apps/" + appName + '?' + param, data, options).success(callback);
  };

  apps.deleteApp = function (appName, callback) {
    $http.delete("/apps/" + appName).success(callback);
  };

  return apps;
}]);

// ------------ Services -------------------
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
            var options = {
              'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }
            }, User = 'aa', Secret = 'dummysecret',
            param = 'User=' + User + "&Secret=" + Secret, data = {},
            url = "/ipgroups/" + $scope.name;

            _.each($scope.IPs, function (val, key) {
              $scope.updatedIPs.push(val.text);
            });

            $scope.updatedIPs = $scope.updatedIPs.join(',');
            data = {'IPs' : $scope.updatedIPs};

            $http.put(url + '?' + param, data, options).success(function (response) {
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

            $http.post(url, $scope.data).success(function(data) {
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
