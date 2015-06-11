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
        })
        $scope.addAlert({
            type: 'success', message: "Supervisor '" + name + "' deleted successfully.",
            icon: 'glyphicon glyphicon-ok'
          });
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
      }, function(result) {
        console.log(result);
      });
    };
}]);
