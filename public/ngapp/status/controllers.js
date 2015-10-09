var controllers = angular.module('atlantisApp.statusControllers', []);

controllers.filter('unique', function () {
  return function (collection, keyname) {
    var output = [],
      keys = [];
    angular.forEach(collection, function (item) {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});

controllers.filter('limitedSha', function () {
  return function (collection) {
    var output = [];
    angular.forEach(collection, function (item) {
      item.Sha = item.Sha.substr(0, 6);
      if (output.indexOf(item.Sha) === -1) {
        output.push(item.Sha);
      }
    });
    return output;
  };
});

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
        $scope.filtered_results = $scope.getFilteredResult($scope.data);
      }
    });

    var isFiltered = function (item) {
      var valid_item = true;
      if ($scope.filterForm.status) {
        if ($scope.filterForm.status !== 'All') {
          if (item.Status !== $scope.filterForm.status) {
            valid_item = false;
          }
        }
      }
      if ($scope.filterForm.env) {
        if ($scope.filterForm.env !== 'All') {
          if (item.Container.Env !== $scope.filterForm.env) {
            valid_item = false;
          }
        }
      }
      if ($scope.filterForm.app) {
        if ($scope.filterForm.app !== 'All') {
          if (item.Container.App !== $scope.filterForm.app) {
            valid_item = false;
          }
        }
      }
      if ($scope.filterForm.sha) {
        if ($scope.filterForm.sha !== 'All') {
          if (item.Container.Sha !== $scope.filterForm.sha) {
            valid_item = false;
          }
        }
      }
      if ($scope.filterForm.host) {
        if ($scope.filterForm.host !== 'All') {
          if (item.Container.Host !== $scope.filterForm.host) {
            valid_item = false;
          }
        }
      }
      return valid_item;
    };

    $scope.getFilteredResult = function (result) {
      var currentResult = [];
      angular.forEach(result, function (value, key) {
        if (isFiltered(value)) {
          if (currentResult.indexOf(value) === -1) {
            currentResult.push(value);
          }
        }
      });
      return currentResult;
    };

    $scope.order = function (order) {
      if (order) {
        $scope.filtered_results = $filter('orderBy')($scope.data, function (data) {
          return data.Container.ID;
        });
      } else {
        $scope.filtered_results = $filter('orderBy')($scope.data, function (data) {
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
      $scope.filtered_results = $scope.data;
    });
  }]);