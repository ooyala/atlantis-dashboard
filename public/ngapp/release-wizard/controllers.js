var controllers = angular.module('atlantisApp.releaseWizardControllers', []);

controllers.controller('ReleaseWizardCtrl', ['$scope', 'appsFactory',
  function($scope, appsFactory) {

  var template_base_path = 'ngapp/release-wizard/templates/';

  $scope.isReleaseWizard = true;

  $scope.tabs = [
    { index: 1, active: true, title: 'Step 1: App-Sha-Environments', template: template_base_path + 'release-step1.html', visited: false },
    { index: 2, active: false, title:'Step 2: Container Settings', template: template_base_path + 'release-step2.html', visited: false },
    { index: 3, active: false, title:'Step 3: Deploy Configuration', template: template_base_path + 'release-step3.html', visited: false },
    { index: 4, active: false, title:'Step 4: Confirm', template: template_base_path + 'release-step4.html', visited: false },
    { index: 5, active: false,title:'Step 5: Results', template: template_base_path + 'release-step5.html', visited: false }
  ];

  appsFactory.list(function(data) {
    $scope.apps = data;
  });

  $scope.currentTab = $scope.tabs[0];

  $scope.processTab = function(tab) {
    if (tab.index == 5) {
      alert('All tabs done');
      return;
    }
    $scope.currentTab = tab;
    $scope.tabs[tab.index].active = true;
    $scope.tabs[tab.index - 1].active = false;
    $scope.tabs[tab.index - 1].visited = true;
  };
}]);
