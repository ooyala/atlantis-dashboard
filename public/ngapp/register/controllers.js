var controllers = angular.module('atlantisApp.supervisorsControllers', []);

controllers.controller('SupervisorsCtrl', ['$scope', '$rootScope', '$state', 'supervisorFactory',
 'deleteSupervisor', 'addSupervisor', '$timeout',
  function($scope, $rootScope, $state, supervisorFactory, deleteSupervisor, addSupervisor, $timeout) {

    $rootScope.title = $state.current.title;
    $scope.supervisors = [];
    $scope.newSupervisor = "";
    $scope.alerts = [];
    supervisorFactory.getSupervisors(function(sup){
      $scope.supervisors = sup.Supervisors;
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

      modalInstance = addSupervisor.modalInstance(templateUrl, name, itemType);
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

      modalInstance = deleteSupervisor.modalInstance(templateUrl, name, type, itemType);
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
