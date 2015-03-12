var services = angular.module('atlantisApp.homeServices', []);

services.factory('datasvc', function(){
  var svc = {};
  svc.getData = function(item){
    var data = item;
    return data;
  }
  return svc;
});
