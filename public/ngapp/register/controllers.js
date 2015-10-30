var controllers = angular.module('atlantisApp.registerControllers', []);

controllers.controller('SupervisorsCtrl', ['$scope', '$rootScope', '$state', 'supervisorFactory',
  'deleteModal', 'addModal', '$timeout',
  function ($scope, $rootScope, $state, supervisorFactory, deleteModal, addModal, $timeout) {

    $rootScope.title = $state.current.title;
    $scope.supervisors = [];
    $scope.newSupervisor = "";
    $scope.alerts = [];

    supervisorFactory.getSupervisors(function (data) {
      $scope.supervisors = data.Supervisors;
    });

    $scope.addAlert = function (alert) {
      $scope.alerts.push(alert);
      $scope.closeAlert($scope.alerts.length - 1);
    };

    $scope.closeAlert = function (index) {
      $timeout(function () {
        $scope.alerts.splice(index, 1);
      }, 3000);
    };

    $scope.addSupervisor = function (currentSup) {
      $scope.newSupervisor = "";
      var templateUrl = 'ngapp/templates/addModal.html',
        name = currentSup,
        itemType = "supervisor";

      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function (name) {
        supervisorFactory.registerSupervisor(name, function (response) {
          supervisorFactory.getSupervisorStatus(response.ID, function (response) {
            if (response.Status === 'DONE') {
              $scope.supervisors.push(name);
              $scope.addAlert({
                type: 'success',
                message: "Supervisor '" + name + "' added successfully.",
                icon: 'glyphicon glyphicon-ok'
              });
            } else {
              $scope.addAlert({
                type: 'danger',
                message: response.Status,
                icon: 'glyphicon glyphicon-remove'
              });
            }
          });
        });
        $scope.newSupervisor = "";
      }, function (result) {
        $scope.newSupervisor = "";
        console.log(result);
      });
    };

    $scope.deleteSupervisor = function (currentSup) {
      var templateUrl = 'ngapp/templates/deleteModal.html',
        name = currentSup,
        type = 'Supervisor',
        itemType = "supervisor";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function (name) {
        supervisorFactory.deleteSupervisor(name, function (response) {
          supervisorFactory.getSupervisorStatus(response.ID, function (response) {
            if (response.Status === 'DONE') {
              $scope.supervisors = _.filter($scope.supervisors, function (supervisor) {
                return currentSup !== supervisor;
              });
              $scope.addAlert({
                type: 'success',
                message: "Supervisor '" + name + "' deleted successfully.",
                icon: 'glyphicon glyphicon-ok'
              });
            } else {
              $scope.addAlert({
                type: 'danger',
                message: response.Status,
                icon: 'glyphicon glyphicon-remove'
              });
            }
          });
          $scope.newSupervisor = "";
        });
      }, function (result) {
        $scope.newSupervisor = "";
        console.log(result);
      });
    };
  }]);

controllers.controller("ManagersCtrl", ["$scope", '$rootScope', '$state', 'managerFactory',
  'deleteModal', 'addModal', '$timeout',
  function ($scope, $rootScope, $state, managerFactory, deleteModal, addModal, $timeout) {

    $scope.region = "";
    $scope.host = "";
    $scope.managerCName = "";
    $scope.registyCName = "";
    $scope.alerts = [];
    $scope.data = {};

    $rootScope.title = $state.current.title;

    managerFactory.getManagers(function (data) {
      $scope.data = data;
    });

    $scope.addAlert = function (alert) {
      $scope.alerts.push(alert);
      $scope.closeAlert($scope.alerts.length - 1);
    };

    $scope.closeAlert = function (index) {
      $timeout(function () {
        $scope.alerts.splice(index, 1);
      }, 3000);
    };

    $scope.addManager = function (currentRegion, currentHost) {
      var templateUrl = 'ngapp/templates/addModal.html',
        name = currentHost,
        itemType = "manager",
        region,
        hosts = [];

      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function (name) {
        region = _.pick($scope.data.Managers, currentRegion);
        if (_.isEmpty(region)) {
          hosts.push(currentHost);
          $scope.data.Managers[currentRegion] = hosts;
        } else {
          _.mapObject(region, function (val, key) {
            if (_.contains(val, currentHost)) {
              $scope.addAlert({
                type: 'danger',
                message: "Manager '" + name + "' already exists.",
                icon: 'glyphicon glyphicon-remove'
              });
            } else {
              $scope.data.Managers[currentRegion].push(currentHost);
              $scope.addAlert({
                type: 'success',
                message: "Manager '" + name + "' added successfully.",
                icon: 'glyphicon glyphicon-ok'
              });
            }
          });
        }
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
      }, function (result) {
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
        console.log(result);
      });
    };

    $scope.deleteManager = function (currentRegion, currentHost) {
      var templateUrl = 'ngapp/templates/deleteModal.html',
        name = currentHost,
        type = 'Manager',
        itemType = "manager",
        region,
        hosts = [];

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function (name) {
        region = _.pick($scope.data.Managers, currentRegion);
        _.mapObject(region, function (val, key) {
          hosts = _.filter(val, function (v) {
            return currentHost !== v;
          });
        });
        $scope.data.Managers[currentRegion] = hosts;
        $scope.addAlert({
          type: 'success',
          message: "Manager '" + name + "' deleted successfully.",
          icon: 'glyphicon glyphicon-ok'
        });
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
      }, function (result) {
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
        console.log(result);
      });
    };
  }]);

controllers.controller("RoutersCtrl", ["$scope", '$rootScope', '$state', 'routerFactory',
  'deleteModal', 'addModal', '$timeout', '$interval',
   function ($scope, $rootScope, $state, routerFactory, deleteModal,
    addModal, $timeout, $interval) {

    $rootScope.title = $state.current.title;
    $scope.zone = "";
    $scope.$parent.zoneBtnText = "Select Zone";
    $scope.host = "";
    $scope.ip = "";
    $scope.alerts = [];
    $scope.data = {};
    $scope.filteredData = {};
    $scope.internal = false;
    $scope.currentZones = [];
    $scope.currentData = {};
    $rootScope.title = $state.current.title;
    $scope.zone = "";
    $scope.zoneBtnText = "Select Zone";
    $scope.internal = false;

    var initializeData = function() {
      $scope.host = "";
      $scope.ip = "";
    };

    routerFactory.getRouters({ Internal: $scope.internal }, function (response) {
      if(response.Status === 'OK') {
        $scope.data = response.Routers;
        $scope.currentData = response.Routers;
      } else {
        $scope.addAlert({
          type: 'danger',
          message: "Error fetching Routers.",
          icon: 'glyphicon glyphicon-remove'
        });
      }
    });

    $scope.addAlert = function (alert) {
      $scope.alerts.push(alert);
      $scope.closeAlert($scope.alerts.length - 1);
    };

    $scope.closeAlert = function (index) {
      $timeout(function () {
        $scope.alerts.splice(index, 1);
      }, 3000);
    };

    $scope.filterData = function (internal) {
      routerFactory.getRouters({ Internal: internal }, function (response) {
        if(response.Status === 'OK') {
          $scope.currentData = response.Routers;
        } else {
          $scope.addAlert({
            type: 'danger',
            message: "Error fetching Routers.",
            icon: 'glyphicon glyphicon-remove'
          });
        }
      });
    };

    $scope.addRouter = function (currentZone, currentHost, IP, Internal) {
      var templateUrl = 'ngapp/templates/addModal.html',
        itemType = "router",
        router,
        host;

      modalInstance = addModal.modalInstance(templateUrl, IP, itemType);
      modalInstance.result.then(function (name) {
        var User = 'aaaa',
          Secret = 'dummysecret',
          Zone = currentZone,
          data = {User, Secret, Internal, IP, Zone};

        routerFactory.registerRouter(currentHost, data, function (task) {
          if (task.ID && task.ID !== '') {
            var timer = $interval(function(){
              routerFactory.getTaskStatus(task.ID, function(response){
                if(response.Status === 'DONE') {
                  $scope.currentData[currentZone].unshift(currentHost);
                  $scope.addAlert({
                    type: 'success',
                    message: "Router '" + currentHost + "' added successfully.",
                    icon: 'glyphicon glyphicon-ok'
                  });
                  $interval.cancel(timer);
                }
              });
            }, 500, 6)
          } else {
            $scope.addAlert({
              type: 'danger',
              message: response,
              icon: 'glyphicon glyphicon-remove'
            });
          }
        });

        initializeData();
      }, function (result) {
        initializeData();
        console.log(result);
      });
    };

    $scope.deleteRouter = function (currentZone, currentHost) {
      var templateUrl = 'ngapp/templates/deleteModal.html',
        type = 'Router',
        itemType = "router",
        router,
        hosts;

      modalInstance = deleteModal.modalInstance(templateUrl, currentHost, type, itemType);
      modalInstance.result.then(function (nam, hostse) {
        var data = {
          User: 'aa', Secret: 'dummysecret', Internal: $scope.internal,
          Host: currentHost, Zone: currentZone
        };

        routerFactory.deleteRouter(data, function (task) {
          if (task.ID && task.ID !== '') {
            var timer = $interval(function(){
              routerFactory.getTaskStatus(task.ID, function(response){
                if(response.Status === 'DONE') {
                  var hosts = $scope.currentData[currentZone];
                  $scope.currentData[currentZone].splice(hosts.indexOf(currentHost), 1);
                  $scope.addAlert({
                    type: 'success',
                    message: "Router '" + currentHost + "' added successfully.",
                    icon: 'glyphicon glyphicon-ok'
                  });
                  $interval.cancel(timer);
                }
              });
            }, 500, 6);
          } else {
            $scope.addAlert({
              type: 'danger',
              message: response,
              icon: 'glyphicon glyphicon-remove'
            });
          }
          initializeData();
        });

        // router = _.filter($scope.currentData, function (data) {
        //   return data.Router.Name === currentZone;
        // });
        // hosts = _.filter(router[0].Router.Host, function (Host) {
        //   return Host.Name !== currentHost;
        // });
        // _.each($scope.currentData, function (data) {
        //   if (data.Router.Name === currentZone) {
        //     data.Router["Host"] = hosts;
        //     return;
        //   }
        // });
        // $scope.addAlert({
        //   type: 'success',
        //   message: "Router '" + currentHost + "' deleted successfully.",
        //   icon: 'glyphicon glyphicon-ok'
        // });
        // initializeData();
      }, function (result) {
        initializeData();
        console.log(result);
      });
    };
  }]);

controllers.controller('IPGroupsCtrl', ['$scope', '$rootScope', '$state', 'ipgrpsFactory',
  'deleteModal', 'addModal', '$timeout', 'updateIPGroup',
  function ($scope, $rootScope, $state, ipgrpsFactory, deleteModal, addModal, $timeout, updateIPGroup) {

    $rootScope.title = $state.current.title;
    $scope.updatedIPs = [];
    $scope.alerts = [];
    $scope.data = {};

    var initializeData = function () {
      $scope.grpName = "";
      $scope.IPs = [];
    };

    initializeData();

    ipgrpsFactory.getIPs(function (data) {
      $scope.data = data.IPGroups;
    });

    $scope.addAlert = function (alert) {
      $scope.alerts.push(alert);
      $scope.closeAlert($scope.alerts.length - 1);
    };

    $scope.closeAlert = function (index) {
      $timeout(function () {
        $scope.alerts.splice(index, 1);
      }, 3000);
    };

    $scope.addIPGroup = function (Name, ips) {
      var templateUrl = 'ngapp/templates/addModal.html',
        name = Name,
        itemType = "IPGroup",
        IPs = [];

      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function (name) {
        var User = 'aaaa',
          Secret = 'dummysecret',
          data = {};

        IPs = _.map(ips, function(ip){ return ip.text; }).join(', ');
        data = {IPs, User, Secret};

        ipgrpsFactory.registerIPGroup(name, data, function (response) {

          if (response.Status === 'OK') {
            if ($scope.data.indexOf(name) === -1) {
              $scope.data.unshift(name);
              $scope.addAlert({
                type: 'success',
                message: "Group Name '" + name + "' added successfully.",
                icon: 'glyphicon glyphicon-ok'
              });
            } else {
              $scope.addAlert({
                type: 'danger',
                message: "Group Name '" + name + "' already exists.",
                icon: 'glyphicon glyphicon-remove'
              });
            }
          } else {
            $scope.addAlert({
              type: 'danger',
              message: response.Status,
              icon: 'glyphicon glyphicon-remove'
            });
          }
        });
        initializeData();
      }, function (result) {
        initializeData();
        console.log(result);
      });
    };

    $scope.deleteIPGroup = function (Name) {
      var templateUrl = 'ngapp/templates/deleteModal.html',
        name = Name,
        type = 'IP Group',
        itemType = "IPGroup";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function (name) {
        ipgrpsFactory.deleteIPGroup(name, function (data) {
          $scope.data.splice($scope.data.indexOf(name), 1)
          $scope.addAlert({
            type: 'success',
            message: "Group '" + name + "' deleted successfully.",
            icon: 'glyphicon glyphicon-ok'
          });
          initializeData();
        });
      }, function (result) {
        initializeData();
        console.log(result);
      });
    };

    $scope.updateIPGroup = function (Name) {
      ipgrpsFactory.getIPInfo(Name, function (data) {
        var templateUrl = 'ngapp/register/templates/updateIPGroup.html',
          name = data.IPGroup.Name,
          itemType = "IPGroup";

        modalInstance = updateIPGroup.modalInstance(templateUrl, name, itemType, data.IPGroup.IPs);
        modalInstance.result.then(function (response) {
          if (response.Status === 'OK') {
            $scope.addAlert({
              type: 'success',
              message: "IP Group '" + name + "' updated successfully.",
              icon: 'glyphicon glyphicon-ok'
            });
          } else {
            $scope.addAlert({
              type: 'danger',
              message: response.Status,
              icon: 'glyphicon glyphicon-remove'
            });
          }
          initializeData();
        });
      }, function (result) {
        initializeData();
        console.log(result);
      });
    };
  }]);

controllers.controller('AppsCtrl', ['$scope', '$rootScope', '$state', 'appsInfoFactory',
 'deleteModal', 'addModal', '$timeout', 'updateApp',
  function ($scope, $rootScope, $state, appsInfoFactory, deleteModal, addModal, $timeout, updateApp) {

    $scope.apps = [];
    $scope.alerts = [];

    $rootScope.title = $state.current.title;

    var initializeData = function () {
      $scope.name = "";
      $scope.root = "";
      $scope.repo = "";
      $scope.email = "";
      $scope.internal = false;
      $scope.non_atlantis = false;
    };

    initializeData();

    appsInfoFactory.getApps(function (data) {
      $scope.apps = data.Apps;
    });

    $scope.addAlert = function (alert) {
      $scope.alerts.push(alert);
      $scope.closeAlert($scope.alerts.length - 1);
    };

    $scope.closeAlert = function (index) {
      $timeout(function () {
        $scope.alerts.splice(index, 1);
      }, 3000);
    };

    $scope.addApps = function (Name, Repo, Root, Email, Internal, NonAtlantis) {
      var templateUrl = 'ngapp/templates/addModal.html',
        name = Name,
        itemType = "apps",
        app = {};

      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function (name) {
        var User = 'aaaa',
          Secret = 'dummysecret',
          data = {Repo, Root, Email, Internal, NonAtlantis, User, Secret};

        appsInfoFactory.registerApp(name, data, function (response) {
          if (response.Status === 'OK') {
            $scope.apps.push(Name);
            $scope.addAlert({
              type: 'success',
              message: "App '" + name + "' added successfully.",
              icon: 'glyphicon glyphicon-ok'
            });
          } else {
            $scope.addAlert({
              type: 'danger',
              message: response.Status,
              icon: 'glyphicon glyphicon-remove'
            });
          }
          initializeData();
        });
      }, function (result) {
        initializeData();
        console.log(result);
      });
    };

    $scope.deleteApp = function (Name) {
      var templateUrl = 'ngapp/templates/deleteModal.html',
        name = Name,
        type = "App",
        itemType = "apps";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function (name) {
        appsInfoFactory.deleteApp(name, function(data){
          $scope.apps = _.filter($scope.apps, function (app) {
            return app != Name;
          });
          $scope.addAlert({
              type: 'success',
              message: "App '" + name + "' deleted successfully.",
              icon: 'glyphicon glyphicon-ok'
          });
          initializeData();
        });
      }, function (result) {
        initializeData();
        console.log(result);
      });
    };

    $scope.updateApp = function (appName) {
      appsInfoFactory.getAppInfo(appName, function (data){
        var templateUrl = 'ngapp/register/templates/updateApp.html',
          name = data.App.Name,
          itemType = "apps",
          root = data.App.Root,
          repo = data.App.Repo,
          email = data.App.Email,
          internal = data.App.Internal,
          non_atlantis = data.App.NonAtlantis;
        modalInstance = updateApp.modalInstance(templateUrl, name, itemType, root, repo,
                        email, internal, non_atlantis);
        modalInstance.result.then(function (data) {
          if (data) {
            $scope.addAlert({
              type: 'success',
              message: "App '" + name + "' updated successfully.",
              icon: 'glyphicon glyphicon-ok'
            });
          } else {
            $scope.addAlert({
              type: 'danger',
              message: data,
              icon: 'glyphicon glyphicon-remove'
            });
          }
          initializeData();
        }, function (result) {
          initializeData();
          console.log(result);
        });
      });
    };

    $scope.setValidityForNonAtlantis = function (non_atlantis) {
      if (non_atlantis) {
        $scope.appInfoForm.repo.$setValidity('required', true);
        $scope.appInfoForm.root.$setValidity('required', true);
      } else {
        $scope.appInfoForm.repo.$setValidity('required', false);
        $scope.appInfoForm.root.$setValidity('required', false);
      }
    };
  }]);
