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
        console.log(result);
      });
    };
}]);

controllers.controller("ManagersCtrl",["$scope", '$rootScope', '$state', 'managerFactory',
  'deleteModal', 'addModal', '$timeout',
  function($scope, $rootScope, $state, managerFactory, deleteModal, addModal, $timeout){

    $scope.region = "";
    $scope.host = "";
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
      }, function(result) {
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
      }, function(result) {
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
    $scope.alerts = [];
    $scope.data = {};

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

    $scope.addRouter = function(currentZone, currentHost){
      var templateUrl = 'ngapp/templates/addModal.html',name = currentHost,
      itemType = "router";
      modalInstance = addModal.modalInstance(templateUrl, name, itemType);
      modalInstance.result.then(function(name) {
        var zone = _.pick($scope.data.Routers, currentZone);
          _.mapObject(zone, function(val,key){
            if(_.contains(val,currentHost)){
              $scope.addAlert({
                type: 'danger', message: "Router '" + name + "' already exists.",
                icon: 'glyphicon glyphicon-remove'
              });
            }else{
              $scope.data.Routers[currentZone].push(currentHost);
              $scope.addAlert({
                type: 'success', message: "Router '" + name + "' added successfully.",
                icon: 'glyphicon glyphicon-ok'
              });
            }
          });
          $scope.zone = "";
          $scope.host = "";
          $scope.zoneBtnText = "Select Zone";
      }, function(result) {
        console.log(result);
      });
    };

    $scope.deleteRouter = function(currentZone, currentHost){
      var templateUrl = 'ngapp/templates/deleteModal.html',name = currentHost,
      type = 'Router', itemType = "router";

      modalInstance = deleteModal.modalInstance(templateUrl, name, type, itemType);
      modalInstance.result.then(function(name) {
        var zone = _.pick($scope.data.Routers, currentZone);
        var hosts = [];
        zone = _.mapObject(zone, function(val, key){
          hosts = _.filter(val, function(v){
            return currentHost != v;
          });
        });
        $scope.data.Routers[currentZone] = hosts;
        $scope.addAlert({
          type: 'success', message: "Router '" + name + "' deleted successfully.",
          icon: 'glyphicon glyphicon-ok'
        });
        $scope.zone = "";
        $scope.host = "";
        $scope.zoneBtnText = "Select Zone";
      }, function(result) {
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
    }
}]);
