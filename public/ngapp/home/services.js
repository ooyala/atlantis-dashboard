var services = angular.module('atlantisApp.homeServices', []);

services.factory('datasvc', ['$http', function($http){
  var selectedApp, svc = {
    apps: [{"Id":1,"Name":"Delphi-UI","Envs":[{"Name":"staging","Container":20,"CPU_Shares":5,"Memory":512,"Dependencies":["Minerva","Helios","CMK"],"Sha":["adf56a4d","bad2313a","basd313a"]},{"Name":"production","Container":3,"CPU_Shares":5,"Memory":256,"Dependencies":["Minerva","Helios","CMK"],"Sha":["n2326a4d","k4543313","osgf313a"]},{"Name":"next-staging","Container":5,"CPU_Shares":10,"Memory":256,"Dependencies":["Minerva","Helios","CMK"],"Sha":["pasdfa4d","t232fd31","basd313a"]}]},{"Id":2,"Name":"Ooyala-Live","Envs":[{"Name":"staging","Container":5,"CPU_Shares":3,"Memory":256,"Dependencies":["Redis","Helios","CMK"],"Sha":["abasdf23","l242afsf","pa23131a"]},{"Name":"production","Container":10,"CPU_Shares":10,"Memory":512,"Dependencies":["Redis","Helios","CMK"],"Sha":["madsfdf2","qerwerfs","kasdf131"]}]}]
  };

  // $http.get('/apps').success(function(data){
  //   svc.apps = data;
  // });

  svc.setSelectedApp = function(app){
    selectedApp = app;
  };

  svc.getSelectedApp = function(){
    return selectedApp;
  };

  return svc;
}]);
