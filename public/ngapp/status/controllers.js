var controllers = angular.module('atlantisApp.statusControllers', []);

controllers.controller('StatusCtrl', ['$scope', '$rootScope', '$state', 'statusFactory', '$filter',
  function ($scope, $rootScope, $state, statusFactory, $filter) {
    $rootScope.title = $state.current.title;
    $scope.data = [];
    $scope.status = ['All'];
    $scope.container = [];
    $scope.filteredResults = [];
    $scope.filterForm = {
      Status : 'All',
      Env : 'All',
      App : 'All',
      Sha : 'All',
      Host : 'All'
    };

    $scope.$watchCollection('filterForm', function (newVal, oldVal) {
      var filterValues;

      $scope.filteredResults = $scope.data;
      filterValues = _.pick(newVal, function (val, key) {
        return val !== 'All';
      });

      if (!_.isEmpty(filterValues)) {
        $scope.filteredResults = $scope.getFilteredResult(filterValues);
      }
    });

    $scope.getFilteredResult = function (filterValues) {
      var currentResult = [];

      angular.forEach($scope.data, function (record) {
        if (statusFactory.isFiltered(filterValues, record)) {
          if (currentResult.indexOf(record) === -1) {
            currentResult.push(record);
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
