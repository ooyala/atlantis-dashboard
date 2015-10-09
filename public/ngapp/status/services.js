var containerStatus = angular.module('atlantisApp.statusServices', []);

containerStatus.factory('statusFactory', ['$http', function ($http) {
  var data = {};

  var callGet = function (url, callback) {
    $http.get(url).success(callback);
  };

  data.getContainers = function (callback) {
    callGet('/instances', callback);
  };

  data.getContainersInfo = function (cont, callback) {
    callGet('/instances/' + cont, callback);
  };

  data.isFiltered = function (filterForm, item) {
    var validItem = true;
    validItem = checkFilter(filterForm.status, item.Status, validItem);
    validItem = checkFilter(filterForm.status, item.Status, validItem);
    validItem = checkFilter(filterForm.env, item.Container.Env, validItem);
    validItem = checkFilter(filterForm.app, item.Container.App, validItem);
    validItem = checkFilter(filterForm.sha, item.Container.Sha, validItem);
    validItem = checkFilter(filterForm.host, item.Container.Host, validItem);
    return validItem;
  }
  return data;
}]);

function checkFilter (formFilterItem, itemFilter, validItem) {
  if (formFilterItem && formFilterItem !== 'All') {
    if (itemFilter !== formFilterItem) {
      return false;
    }
  }
  if (validItem) {
    return true;
  } else {
    return false;
  }
}
