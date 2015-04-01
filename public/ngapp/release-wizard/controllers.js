var controllers = angular.module('atlantisApp.releaseWizardControllers', []);

controllers.controller('ReleaseWizardCtrl', ['$scope', function($scope) {
  var template_base_path = 'ngapp/release-wizard/templates/';

  $scope.isReleaseWizard = true;

  $scope.tabs = [
    { index: 1, title: 'Step 1: App-Sha-Environments', template: template_base_path + 'release-step1.html', disabled: false },
    { index: 2, title:'Step 2: Container Settings', template: template_base_path + 'release-step2.html', disabled: false },
    { index: 3, title:'Step 3: Deploy Configuration', template: template_base_path + 'release-step3.html', disabled: true },
    { index: 4, title:'Step 4: Confirm', template: template_base_path + 'release-step4.html', disabled: true },
    { index: 5, title:'Step 5: Results', template: template_base_path + 'release-step5.html', disabled: true }
  ];

  $scope.processTab = function(currentTab) {
    if (currentTab.index == 5) {
      alert('All tabs done');
      return;
    }
    $scope.tabs[currentTab.index].disabled = false;
    $scope.tabs[currentTab.index - 1].disabled = true;
    $scope.tabs[currentTab.index - 1].active = false;
  };
}]);
