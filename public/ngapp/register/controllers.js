var controllers = angular.module('atlantisApp.registerControllers', []);

controllers.controller('SupervisorsCtrl', ['$scope', '$rootScope', '$state', 'supervisorFactory',
 'deleteModal', 'addModal', '$timeout',
  function($scope, $rootScope, $state, supervisorFactory, deleteModal, addModal, $timeout) {

    $rootScope.title = $state.current.title;
    $scope.supervisors = [];
    $scope.newSupervisor = "";
    $scope.alerts = [];
    supervisorFactory.getSupervisors(function(data){
      $scope.supervisors = data.Supervisors;
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

    $scope.addSupervisor = function(currentSup){
      $scope.newSupervisor = "";
      var templateUrl = 'ngapp/templates/addModal.html',name = currentSup,
      itemType = "supervisor";

      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function(name) {
        $scope.sup = _.filter($scope.supervisors, function(supervisor) {
            return currentSup == supervisor;
          })
          if(_.isEmpty($scope.sup)){
            $scope.supervisors.push(currentSup);
            $scope.addAlert({
              type: 'success', message: "Supervisor '" + name + "' added successfully.",
              icon: 'glyphicon glyphicon-ok'
            });
          }else{
            $scope.addAlert({
              type: 'danger', message: "Supervisor '" + name + "' already exists.",
              icon: 'glyphicon glyphicon-remove'
            });
          }
          $scope.newSupervisor = "";
        }, function(result) {
          $scope.newSupervisor = "";
          console.log(result);
      });
    };

    $scope.deleteSupervisor = function(currentSup){
      var templateUrl = 'ngapp/templates/deleteModal.html',name = currentSup,
      type = 'Supervisor', itemType = "supervisor";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function(name) {
        $scope.supervisors = _.filter($scope.supervisors, function(supervisor) {
          return currentSup !== supervisor;
        });
        $scope.addAlert({
            type: 'success', message: "Supervisor '" + name + "' deleted successfully.",
            icon: 'glyphicon glyphicon-ok'
        });
        $scope.newSupervisor = "";
        }, function(result) {
          $scope.newSupervisor = "";
          console.log(result);
      });
    };
}]);

controllers.controller("ManagersCtrl",["$scope", '$rootScope', '$state', 'managerFactory',
  'deleteModal', 'addModal', '$timeout',
  function($scope, $rootScope, $state, managerFactory, deleteModal, addModal, $timeout){

    $scope.region = "";
    $scope.host = "";
    $scope.managerCName = "";
    $scope.registyCName = "";
    $scope.alerts = [];
    $scope.data = {};

    $rootScope.title = $state.current.title;

    managerFactory.getManagers(function(data){
      $scope.data = data;
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

    $scope.addManager = function(currentRegion, currentHost){
      var templateUrl = 'ngapp/templates/addModal.html',name = currentHost,
      itemType = "manager";
      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function(name) {
        var region = _.pick($scope.data.Managers, currentRegion);
        if(_.isEmpty(region)){
          var hosts = [];
          hosts.push(currentHost);
          $scope.data.Managers[currentRegion] = hosts;
        }else{
          var mananger = {};
          _.mapObject(region, function(val,key){
            if(_.contains(val,currentHost)){
              $scope.addAlert({
                type: 'danger', message: "Manager '" + name + "' already exists.",
                icon: 'glyphicon glyphicon-remove'
              });
            }else{
              $scope.data.Managers[currentRegion].push(currentHost);
              $scope.addAlert({
                type: 'success', message: "Manager '" + name + "' added successfully.",
                icon: 'glyphicon glyphicon-ok'
              });
            }
          });
        }
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
      }, function(result) {
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
        console.log(result);
      });
    };

    $scope.deleteManager = function(currentRegion, currentHost){
      var templateUrl = 'ngapp/templates/deleteModal.html',name = currentHost,
      type = 'Manager', itemType = "manager";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function(name) {
        var region = _.pick($scope.data.Managers, currentRegion);
        var hosts = [];
        var mananger = {};
        region = _.mapObject(region, function(val, key){
          hosts = _.filter(val, function(v){
              return currentHost != v;
          });
        });
        $scope.data.Managers[currentRegion] = hosts;
        $scope.addAlert({
            type: 'success', message: "Manager '" + name + "' deleted successfully.",
            icon: 'glyphicon glyphicon-ok'
        });
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
      }, function(result) {
        $scope.region = "";
        $scope.host = "";
        $scope.managerCName = "";
        $scope.registyCName = "";
        console.log(result);
      });
    };
}]);

controllers.controller("RoutersCtrl",["$scope", '$rootScope', '$state', 'routerFactory',
  'deleteModal', 'addModal', '$timeout',
   function($scope, $rootScope, $state, routerFactory, deleteModal, addModal, $timeout){

    $rootScope.title = $state.current.title;
    $scope.zone = "";
    $scope.$parent.zoneBtnText = "Select Zone";
    $scope.host = "";
    $scope.ip = "";
    $scope.alerts = [];
    $scope.data = {};
    $scope.internal = false;

    $rootScope.title = $state.current.title;

    routerFactory.getRouters(function(data){
      $scope.data = data;
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

    $scope.addRouter = function(currentZone, currentHost, Internal){
      var templateUrl = 'ngapp/templates/addModal.html',name = currentHost,
      itemType = "router";
      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function(name) {
        var router = _.filter($scope.data, function(data){
          return data.Router.Name == currentZone;
        });
        var Host = _.filter(router[0].Router.Host, function(Host){
          return Host == currentHost;
        });
        if(_.isEmpty(Host)){
          _.each($scope.data, function(data){
            if(data.Router.Name == currentZone){
              data.Router["Host"].push(currentHost);
              return;
            }
          });
          $scope.addAlert({
            type: 'success', message: "Router '" + name + "' added successfully.",
            icon: 'glyphicon glyphicon-ok'
          });
        }else{
          $scope.addAlert({
            type: 'danger', message: "Router '" + name + "' already exists.",
            icon: 'glyphicon glyphicon-remove'
          });
        }
        $scope.zone = "";
        $scope.host = "";
        $scope.ip = "";
        $scope.zoneBtnText = "Select Zone";
        $scope.internal = false;
      }, function(result) {
        $scope.zone = "";
        $scope.host = "";
        $scope.ip = "";
        $scope.zoneBtnText = "Select Zone";
        $scope.internal = false;
        console.log(result);
      });
    };

    $scope.deleteRouter = function(currentZone, currentHost){
      var templateUrl = 'ngapp/templates/deleteModal.html',name = currentHost,
      type = 'Router', itemType = "router";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function(name) {
        // var zone = _.pick($scope.data.Routers, currentZone);
        var router = _.filter($scope.data, function(data){
          return data.Router.Name == currentZone;
        });
        var hosts = _.filter(router[0].Router.Host, function(Host){
          return Host != currentHost;
        });
        _.each($scope.data, function(data){
            if(data.Router.Name == currentZone){
              data.Router["Host"] = hosts;
              return;
            }
          });
        $scope.addAlert({
          type: 'success', message: "Router '" + name + "' deleted successfully.",
          icon: 'glyphicon glyphicon-ok'
        });
        $scope.zone = "";
        $scope.host = "";
        $scope.ip = "";
        $scope.zoneBtnText = "Select Zone";
        $scope.internal = false;
      }, function(result) {
        $scope.zone = "";
        $scope.host = "";
        $scope.ip = "";
        $scope.zoneBtnText = "Select Zone";
        $scope.internal = false;
        console.log(result);
      });
    };
}]);

controllers.controller('IPGroupsCtrl', ['$scope', '$rootScope', '$state', 'ipgrpsFactory',
 'deleteModal', 'addModal', '$timeout', 'updateIPGroup',
  function($scope, $rootScope, $state, ipgrpsFactory, deleteModal, addModal, $timeout, updateIPGroup) {

    $rootScope.title = $state.current.title;
    $scope.grpName = "";
    $scope.IPs = [];
    $scope.alerts = [];
    $scope.data = {};

    ipgrpsFactory.getIPInfo(function(data){
      $scope.data = data;
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

    $scope.addIPGroup = function(Name, ips){
      var templateUrl = 'ngapp/templates/addModal.html',name = Name,
      itemType = "IPGroup";
      var grp = {};
      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function(name) {
        grp = _.filter($scope.data.IPGroups, function(ipgrp) {
            return ipgrp.Name == Name;
          });
          if(_.isEmpty(grp)){
            var IPs = [];
            _.each(ips,function(val,key){
              IPs.push(val.text);
            })
            $scope.data.IPGroups.push({Name ,IPs});
            $scope.addAlert({
              type: 'success', message: "Group Name '" + name + "' added successfully.",
              icon: 'glyphicon glyphicon-ok'
            });
          }else{
            $scope.addAlert({
              type: 'danger', message: "Group Name '" + name + "' already registered.   Update if you want to add IP.",
              icon: 'glyphicon glyphicon-remove'
            });
          }
          $scope.grpName = "";
          $scope.IPs = [];
        }, function(result) {
          $scope.grpName = "";
          $scope.IPs = [];
          console.log(result);
      });
    };

    $scope.deleteIPGroup = function(Name){
      var templateUrl = 'ngapp/templates/deleteModal.html',name = Name,
      type = 'IP Group', itemType = "IPGroup";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function(name) {
        $scope.data.IPGroups = _.filter($scope.data.IPGroups, function(ipgrp) {
          return ipgrp.Name != Name;
        });
        $scope.addAlert({
            type: 'success', message: "Group '" + name + "' deleted successfully.",
            icon: 'glyphicon glyphicon-ok'
        });
        $scope.grpName = "";
        $scope.IPs = [];
        }, function(result) {
          $scope.grpName = "";
          $scope.IPs = [];
          console.log(result);
      });
    };

    $scope.updateIPGroup = function(Name){
      var templateUrl = 'ngapp/register/templates/updateIPGroup.html',name = Name,
      itemType = "IPGroup";
      var grp = {};
      grp = _.filter($scope.data.IPGroups, function(ipgrp) {
        return ipgrp.Name == Name;
      });
      _.each(grp,function(data){
        _.each(data.IPs,function(ip){
          $scope.IPs.push({'text': ip});
        });
      });
      modalInstance = updateIPGroup.modalInstance(templateUrl, name, itemType, $scope.IPs);
      modalInstance.result.then(function() {
        _.filter($scope.data.IPGroups, function(ipgrp) {
         if (ipgrp.Name == Name){
          ipgrp.IPs = [];
          _.each($scope.IPs,function(val,key){
            ipgrp.IPs.push(val.text);
          });
        }
      });
      $scope.grpName = "";
      $scope.IPs = [];
      }, function(result) {
        $scope.grpName = "";
        $scope.IPs = [];
        console.log(result);
      });
    };
}]);

controllers.controller('AppsCtrl', ['$scope', '$rootScope', '$state', 'appsInfoFactory',
 'deleteModal', 'addModal', '$timeout', 'updateApp',
  function($scope, $rootScope, $state, appsInfoFactory, deleteModal, addModal, $timeout, updateApp) {

    $scope.apps = {};
    $scope.name = "";
    $scope.root = "";
    $scope.repo = "";
    $scope.email = "";
    $scope.alerts = [];
    $scope.internal = false;
    $scope.non_atlantis = false;

    $rootScope.title = $state.current.title;

    appsInfoFactory.getAppInfo(function(data){
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

    $scope.addApps = function(Name, Root, Repo, Email, Internal, NonAtlantis){
      var templateUrl = 'ngapp/templates/addModal.html',name = Name,
      itemType = "apps";
      var app = {};
      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function(name) {
        app = _.filter($scope.apps, function(app) {
          return app.App.Name == Name;
        });
        if(_.isEmpty(app)){
          $scope.apps.push({"App":{Name ,Root, Repo, Email, Internal, NonAtlantis}});
          $scope.addAlert({
            type: 'success', message: "App '" + name + "' added successfully.",
            icon: 'glyphicon glyphicon-ok'
          });
        }else{
          $scope.addAlert({
            type: 'danger', message: "App '" + name + "' already registered. Please update.",
            icon: 'glyphicon glyphicon-remove'
          });
        }
        $scope.name = "";
        $scope.root = "";
        $scope.repo = "";
        $scope.email = "";
        $scope.internal = false;
        $scope.non_atlantis = false;
      }, function(result) {
        $scope.name = "";
        $scope.root = "";
        $scope.repo = "";
        $scope.email = "";
        $scope.internal = false;
        $scope.non_atlantis = false;
        console.log(result);
      });
    };

    $scope.deleteApp = function(Name){
      var templateUrl = 'ngapp/templates/deleteModal.html',name = Name,
      type = "App", itemType = "apps";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function(name) {
        $scope.apps = _.filter($scope.apps, function(app) {
          return app.App.Name != Name;
        });
        $scope.addAlert({
            type: 'success', message: "App '" + name + "' deleted successfully.",
            icon: 'glyphicon glyphicon-ok'
        });
        $scope.name = "";
        $scope.root = "";
        $scope.repo = "";
        $scope.email = "";
        $scope.internal = false;
        $scope.non_atlantis = false;
        }, function(result) {
          $scope.name = "";
          $scope.root = "";
          $scope.repo = "";
          $scope.email = "";
          $scope.internal = false;
          $scope.non_atlantis = false;
        console.log(result);
      });
    };

    $scope.updateApp = function(name, root, repo, email, internal, non_atlantis){
      var templateUrl = 'ngapp/register/templates/updateApp.html',name = name,
      itemType = "apps", root = root, repo = repo, email = email, internal = internal,
      non_atlantis = non_atlantis;

      modalInstance = updateApp.modalInstance(templateUrl, name, itemType, root, repo,
                      email, internal, non_atlantis);
      modalInstance.result.then(function(data) {
        _.filter($scope.apps, function(app) {
          if (app.App.Name == name){
            app.App.Root = data.root;
            app.App.Repo = data.repo;
            app.App.Email = data.email;
          }
        });
      }, function(result) {
        $scope.name = "";
        $scope.root = "";
        $scope.repo = "";
        $scope.email = "";
        $scope.internal = false;
        $scope.non_atlantis = false;
        console.log(result);
      });
    };
}]);
