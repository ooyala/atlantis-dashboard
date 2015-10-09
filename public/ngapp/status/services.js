var containerStatus = angular.module('atlantisApp.statusServices', []);

containerStatus.factory('statusFactory', ['$http', function ($http) {
  var data = {};

  var callGet = function (url, callback) {
    $http.get(url).success(callback);
  };

  data.getContainers = function (callback){
    callGet('/instances', callback);
  };

  data.getContainersInfo = function (cont,callback){
    callGet('/instances/' + cont, callback);
  };

  return data;
}]);