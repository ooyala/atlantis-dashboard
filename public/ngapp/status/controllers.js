var controllers = angular.module('atlantisApp.statusControllers', []);

controllers.controller('StatusCtrl', ['$scope', '$rootScope', '$state', 'statusFactory', '$filter',
  function ($scope, $rootScope, $state, statusFactory, $filter) {
    $rootScope.title = $state.current.title;
    $scope.data = [];
    $scope.status = ['All'];
    $scope.container = [];
    $scope.filterForm = {
      status : '',
      env : 'All',
      app : 'All',
      sha : 'All',
      host : 'All'
    };

    $scope.$watchCollection('filterForm', function (newVal, oldVal) {
      if ($scope.data) {
        $scope.filteredResults = $scope.getFilteredResult($scope.data);
      }
    });

    $scope.getFilteredResult = function (result) {
      var currentResult = [];
      angular.forEach(result, function (value, key) {
        if (statusFactory.isFiltered($scope.filterForm, value)) {
          if (currentResult.indexOf(value) === -1) {
            currentResult.push(value);
          }
        }
      });
      return currentResult;
    };


    // This function will decide the orderby sequence for container id.
    $scope.order = function (order) {
      if (order) {
        $scope.filteredResults = $filter('orderBy')($scope.data, function (data) {
          return data.Container.ID;
        });
      } else {
        $scope.filteredResults = $filter('orderBy')($scope.data, function (data) {
          return -data.Container.ID;
        });
      }
    };

    statusFactory.getContainers(function (data) {
      $scope.containerIDs = data.ContainerIDs;
      angular.forEach($scope.containerIDs, function (containerID) {
        statusFactory.getContainersInfo(containerID, function (data) {
          $scope.container.push(data.Container);
          if ($scope.status.indexOf(data.Status) === -1) {
            $scope.status.push(data.Status);
          }
          $scope.data.push(data);
        });
      });
      $scope.filteredResults = $scope.data;
    });
  }]);
