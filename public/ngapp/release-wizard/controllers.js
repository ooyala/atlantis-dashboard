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

  $scope.envs = [
    { Name: 'staging', CurrentSha: '34ddef' },
    { Name: 'next-staging', CurrentSha: '8b2sdf' },
    { Name: 'production-0', CurrentSha: '95df1c' },
    { Name: 'production-1', CurrentSha: '5a4sdf' },
    { Name: 'next-staging-dark', CurrentSha: '8b2sdf' },
    { Name: 'next-next-staging-dark', CurrentSha: '8b2sdf' },
    { Name: 'staging-dark', CurrentSha: '34ddef' },
  ];

  $scope.currentTab = $scope.tabs[0];
  $scope.selectedEnvs = [];
  $scope.appBtnText = 'Select App';

  $scope.nextStep = function() {
    var nextTab = $scope.tabs[$scope.currentTab.index];
    if (nextTab.index == 5) {
      alert('All tabs done');
      return;
    }
    nextTab.active = true;
    $scope.currentTab.active = false;
    $scope.currentTab.visited = true;
    $scope.currentTab = nextTab;
  };

  $scope.selectApp = function(app) {
    $scope.appBtnText = $scope.selectedApp = app.Name;
  };

  $scope.selectEnv = function(env, a) {
    $scope.selectedEnvs.push(env);
  };
}]);
