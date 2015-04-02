var controllers = angular.module('atlantisApp.homeControllers', []);

controllers.controller('DashboardCtrl', ['$scope', '$timeout', 'appsFactory',
  function($scope, $timeout, appsFactory) {

  $scope.alerts = [];
  $scope.envs = [];
  $scope.deps = [];
  $scope.isEnvEnable = $scope.isAppVisible = $scope.isEnvSelected = false;
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

  $scope.addAlert = function(alert) {
    $scope.alerts.push(alert);
    $scope.closeAlert($scope.alerts.length - 1);
  };

  $scope.closeAlert = function(index) {
    $timeout(function(){
      $scope.alerts.splice(index, 1);
    }, 3000);
  };

  $scope.showRegisterDependency = function() {
    $scope.isRegisterDependency = true;
    appsFactory.getDeps(function(data) {
      $scope.deps = data;
    });
  };

  $scope.showNewEnvironment = function() {
    $scope.isEnvironment = true;
    $scope.isRegisterDependency = false;
    appsFactory.getDeps(function(data) {
      $scope.deps = data;
    });
  };
}]);

controllers.controller('DashboardBodyCtrl', ['$scope', '$stateParams', '$modal',
  'appsFactory', 'deleteModal', function ($scope, $stateParams, $modal, appsFactory,
  deleteModal) {

  $scope.isShowEnvPanel = false;
  $scope.$parent.isAppVisible = true;
  $scope.$parent.isEnvSelected = false;
  $scope.$parent.isRegisterDependency = $scope.$parent.isEnvironment = false;

  appsFactory.findById($stateParams.id, function(app){
    $scope.$parent.isEnvEnable = false;
    $scope.app = app;
    $scope.$parent.appBtnText = app.Name;
    $scope.envs = app.Envs;
    $scope.$parent.envBtnText = "Choose here";        // reset
    $scope.$parent.envs = app.Envs;
  });

  $scope.deleteEnv = function(env) {
    var templateUrl = 'ngapp/home/templates/deleteModal.html',
        type = 'environment name', name = env.Name, itemType = 'env';

    modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
    modalInstance.result.then(function(name) {
      $scope.envs = _.filter($scope.envs, function(env) {
        return env.Name !== name;
      })
      $scope.addAlert({
        type: 'success', message: "Environment '" + name + "' deleted successfully.",
        icon: 'glyphicon glyphicon-ok'
      });
    }, function(result) {
      console.log(result);
    });
  };

  $scope.createEnv = function() {
    var env = {
      "Name": $scope.newEnvName,
      "ContainersPerZone": 0,
      "CPUShares": 0,
      "Memory": 0,
      "Dependencies": [],
      "Shas": []
    };

    $scope.envs.push(env);
    $scope.addAlert({
      type: 'success', message: "Environment '" + env.Name + "' created successfully.",
      icon: 'glyphicon glyphicon-ok'
    });
    $scope.newEnvName = '';
    $scope.$parent.isEnvironment = false;
  };

  $scope.dropValidateHandler = function($drop, $event, $data) {
    var target = $event.target || $event.srcElement;
    if ($drop.element[0] === target.parentNode) {
      // Don't allow moving to same container
      return false;
    }
    return true;
  };

  $scope.onDrop = function($event, $data, array, index) {
    var alert = {
      type: 'danger', message: "Error dropping dependency.",
      icon: 'glyphicon glyphicon-remove'
    }
    deps = _.filter(array[index].Dependencies, function(dep) {
      return $data.Name === dep.Name;
    });
    if(deps.length > 0) {
      $scope.addAlert({
        type: 'danger', message: "Dependency '" + $data.Name + "' aleardy registered.",
        icon: 'glyphicon glyphicon-remove'
      });
      return;
    }
    if (index !== undefined) {
      $data.Status = 'Pending Request';
      if(!array[index].Dependencies) {
        return;
      }
      array[index].Dependencies.push($data);
      alert.type = 'success';
      alert.icon = 'glyphicon glyphicon-ok';
      alert.message = "Dependency '" + $data.Name + "' added for registration.";
    }
    $scope.addAlert(alert);
  };

  $scope.handleDependency = function(env, dep, action) {
    var index;
    if(action === 'accept') {
      dep.Status = 'OK';
      dep.Host = 'internal-router.services.ooyala.com';
      dep.Port = 45935;
      $scope.addAlert({
        type: 'success', message: "Dependency '" + dep.Name + "' registered successfully.",
        icon: 'glyphicon glyphicon-ok'
      });
    } else {
      env.Dependencies = _.filter(env.Dependencies, function(record){ return record.Name != dep.Name });
      $scope.addAlert({
        type: 'success', message: "Dependency '" + dep.Name + "' removed successfully.",
        icon: 'glyphicon glyphicon-ok'
      });
    }
  };

  $scope.handleEnvPanelVisibility = function() {
    $scope.isShowEnvPanel = !$scope.isShowEnvPanel;
  };

  $scope.closeEnvPanel = function() {
    $scope.$parent.isEnvironment = false;
  };
}]);

controllers.controller('EnvContentCtrl', ['$scope', '$modal', '$stateParams', 'appsFactory',
  'deleteModal', function ($scope, $modal, $stateParams, appsFactory, deleteModal) {

  $scope.visibleInfo = [
    "Name", "Host", "PrimaryPort", "SecondaryPorts", "SSHPort", "DockerID", "ID",
    "Description", "CPUShares", "MemoryLimit", "AppType"
  ];

  $scope.$parent.envBtnText = $stateParams.name;
  $scope.$parent.isEnvEnable = true;
  $scope.$parent.isEnvSelected = true;
  $scope.$parent.headerTitle = "Environment Detail / Container Management";
  $scope.isShaInfoEnabled = false;

  appsFactory.findEnv($stateParams.id, $stateParams.name, function(env, app) {
    $scope.$parent.appBtnText = app.Name;
    $scope.$parent.envs = app.Envs;
    $scope.env = env;
    $scope.shas = env.Shas;
  });

  $scope.isActive = function(sha_id, region) {
    return $scope.selectedShaId === sha_id && $scope.region.Name == region;
  };

  $scope.isContainerActive = function(container) {
    return $scope.containerInfo.Name === container.Name;
  };

  $scope.renderShaInfo = function(sha_id, region) {
    $scope.isContainerInfoVisible = false;
    $scope.containerInfo = {};
    $scope.region = {}
    appsFactory.getShaById(sha_id, function(data) {
      $scope.region = _.filter(data.Regions, function(record) {
        return record.Name == region;
      })[0];
      if(!_.isEmpty($scope.region)) {
        $scope.containers = $scope.region.Containers;
        $scope.selectedSha = data;
        $scope.selectedShaId = sha_id;
        $scope.isShaInfoEnabled = true;
      }
    });
  };

  $scope.renderContainerInfo = function(container) {
    $scope.isContainerInfoVisible = true;
    $scope.containerInfo = $scope.filterContainerInfo(container);
  };

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
  };

  $scope.deleteSha = function(sha) {
    var templateUrl = 'ngapp/home/templates/deleteModal.html',
        type = 'sha ID', name = sha.ShaId, itemType = 'sha';

    modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
    modalInstance.result.then(function(name) {
      $scope.shas = _.filter($scope.shas, function(sha) {
        return sha.ShaId !== name;
      })
      $scope.addAlert({
        type: 'success', message: "Sha '" + name + "' deleted successfully.",
        icon: 'glyphicon glyphicon-ok'
      });
      $scope.isShaInfoEnabled = false;
    }, function(result) {
      console.log(result);
    });
  };

  $scope.deleteContainer = function(container) {
    var templateUrl = 'ngapp/home/templates/deleteModal.html',
        type = 'container name', name = container.Name, itemType = 'container';

    modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
    modalInstance.result.then(function(name) {
      $scope.containers = _.filter($scope.containers, function(container) {
        return container.Name !== name;
      })
      $scope.addAlert({
        type: 'success', message: "Container '" + name + "' deleted successfully.",
        icon: 'glyphicon glyphicon-ok'
      });
      $scope.isContainerInfoVisible = false;
    }, function(result) {
      console.log(result);
    });
  };

  $scope.handleDependency = function(env, dep, action) {
    var index;
    if(action === 'accept') {
      dep.Status = 'OK';
      dep.Host = 'internal-router.services.ooyala.com';
      dep.Port = 45935;
      $scope.addAlert({
        type: 'success', message: "Dependency '" + dep.Name + "' registered successfully.",
        icon: 'glyphicon glyphicon-ok'
      });
    } else {
      env.Dependencies = _.filter(env.Dependencies, function(record){ return record.Name != dep.Name });
      $scope.addAlert({
        type: 'success', message: "Dependency '" + dep.Name + "' removed successfully.",
        icon: 'glyphicon glyphicon-ok'
      });
    }
  };
}]);
