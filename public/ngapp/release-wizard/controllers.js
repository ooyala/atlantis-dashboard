var controllers = angular.module('atlantisApp.releaseWizardControllers', []);

controllers.controller('ReleaseWizardCtrl', ['$scope', '$state', 'appsFactory',
  function($scope, $state, appsFactory) {

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
  $scope.results = [];
  $scope.appBtnText = 'Select App';

  $scope.resetWizard = function() {
    $scope.selectedEnvs = [];
    $scope.results = [];
    $scope.appBtnText = 'Select App';
    $scope.container_ram = '';
    $scope.containers_per_zone = '';
    $scope.cpu_shares = '';
    $scope.shaToDeploy = '';

    _.each($scope.tabs, function(tab) {
      tab.active = false;
      tab.visited = false;
    });
  };

  $scope.nextStep = function() {
    var record,
        nextTab = $scope.tabs[$scope.currentTab.index];

    nextTab.active = true;
    $scope.currentTab.active = false;
    $scope.currentTab.visited = true;
    $scope.currentTab = nextTab;

    if ($scope.notify_on_success) {
      $scope.post_deploy_message = "Email Notification"
    }

    if (nextTab.index == 5) {
      _.each($scope.selectedEnvs, function(env) {
        record = {
          DeployID: $scope.randString(5),
          Details: {
            App: $scope.selectedApp,
            Environment: env.Name,
            Sha: $scope.shaToDeploy,
            RAM: $scope.container_ram,
            CPUShares: $scope.cpu_shares,
            ContainerPerZone: $scope.containers_per_zone,
            PostDeployMessage: $scope.post_deploy_message
          },
          DeployingContainers: [
            { Region: 'us-east-1a', isDeployed: true },
            { Region: 'us-east-1b', isDeployed: true },
            { Region: 'us-east-1d', isDeployed: true }
          ],
          SanityChecks: {
            DependenciesFulfilled: true,
            JenkinsTestsPass: true
          },
          PostDeploy: {
            Type: 'Email Notification',
            isNotified: false
          }
        }
        $scope.results.push(record);
      });
    }
  };

  $scope.randString = function(n){
    n = n || 5;
    return Math.random().toString(36).substring(2, n+2);
  };

  $scope.selectApp = function(app) {
    $scope.appBtnText = $scope.selectedApp = app.Name;
  };

  $scope.selectEnv = function(env, a) {
    $scope.selectedEnvs.push(env);
  };

  $scope.goToDashboard = function() {
    $state.go('root.dashboard');
  };

  $scope.deployAnotherApp = function() {
    $scope.resetWizard();
    $scope.currentTab = $scope.tabs[0];
    $scope.currentTab.active = true;
  };
}]);
