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

  data.isFiltered = function (filterValues, item) {
    var validItem = true;

    angular.forEach(filterValues, function(value, key){
      if(key === 'Status' && value !== item.Status) {
        validItem = false;
      } else if(key !== 'Status' && value !== item.Container[key]) {
        validItem = false;
      }
    });
    return validItem;
  }
  return data;
}]);
