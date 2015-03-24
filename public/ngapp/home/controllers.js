var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$http', '$state', 'appsFactory',
  function($scope, $http, $state, appsFactory) {

  $scope.envs = [];
  $scope.isEnvEnable = false;
  $scope.envBtnText  = $scope.appBtnText = "Choose here";
  $scope.headerTitle = "Environment Configuration And Management";
  $scope.appStatus = {
    isopen: false
  };
  $scope.envStatus = {
    isopen: false
  };

  appsFactory.list(function(data) {
    $scope.apps = data;
  });
}]);

controllers.controller('DashboardBodyCtrl', ['$scope', '$stateParams', '$modal',
  'appsFactory', function ($scope, $stateParams, $modal, appsFactory) {

  appsFactory.findById($stateParams.id, function(app){
    $scope.$parent.isEnvEnable = false;
    $scope.app = app;
    $scope.$parent.appBtnText = app.Name;
    $scope.envs = app.Envs;
    $scope.$parent.envBtnText = "Choose here";        // reset
    $scope.$parent.envs = app.Envs;
  })

  $scope.deleteEnv = function(env) {
    var modalInstance = $modal.open({
      templateUrl: 'deleteModal.html',
      controller: function ($scope, $modalInstance, envName) {
        $scope.envName = envName;
        $scope.ok = function () {
          $modalInstance.close(envName);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      },
      resolve: {
        envName: function() {
          return env.Name;
        }
      }
    });

    modalInstance.result.then(function(envName) {
      $scope.envs = _.filter($scope.envs, function(env) {
        return env.Name !== envName;
      })
    }, function(result) {
      console.log(result);
    });
  };
}]);

controllers.controller('EnvContentCtrl', ['$scope', '$stateParams', 'appsFactory',
  function ($scope, $stateParams, appsFactory) {
  $scope.visibleInfo = [
    "Name", "Host", "PrimaryPort", "SecondaryPorts", "SSHPort", "DockerID", "ID",
    "Description", "CPUShares", "MemoryLimit", "AppType"
  ];

  $scope.$parent.envBtnText = $stateParams.name;
  $scope.$parent.isEnvEnable = true;
  $scope.$parent.headerTitle = "Environment Detail / Container Management";
  $scope.isShaInfoPanelEnabled = false;

  appsFactory.findEnv($stateParams.id, $stateParams.name, function(env, app) {
    $scope.$parent.appBtnText = app.Name;
    $scope.$parent.envs = app.Envs;
    $scope.env = env;
  })

  $scope.isActive = function(sha_id, region) {
    return $scope.selectedShaId === sha_id && $scope.region.Name == region;
  }

  $scope.isContainerActive = function(container) {
    return $scope.containerInfo.Name === container.Name;
  }

  $scope.renderShaInfo = function(sha_id, region) {

    $scope.isContainerInfoVisible = false;
    $scope.containerInfo = {};
    $scope.region = {}
    appsFactory.getShaById(sha_id, function(data) {
      $scope.region = _.filter(data.Regions, function(record) {
        return record.Name == region;
      })[0];
      if(!_.isEmpty($scope.region)) {
        $scope.selectedSha = data;
        $scope.selectedShaId = sha_id;
        $scope.isShaInfoEnabled = true;
      }
    });
  }

  $scope.renderContainerInfo = function(container) {
    $scope.isContainerInfoVisible = true;
    $scope.containerInfo = $scope.filterContainerInfo(container);
  }

  $scope.filterContainerInfo = function(container) {
    var info = {};
    _.each(container, function(value, key) {
      if($scope.visibleInfo.indexOf(key) !== -1) {
        if(key === 'DockerID') {
          // info[key] = value.slice(0, 20) + "...";
          info[key] = value;
        } else if(key === 'Manifest') {
          _.each(value, function(v, k) {
            info[k] = v;
          });
        } else {
          info[key] = value;
        }
      }
    });
    info["Healthz"] = "http://" + info.Host + ":" + info.PrimaryPort + "/healthz";
    info["To SSH"] = "atlantis ssh " + info.ID;
    return info;
  }
}]);
