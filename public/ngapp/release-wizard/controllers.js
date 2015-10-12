var controllers = angular.module('atlantisApp.releaseWizardControllers', []);

controllers.controller('ReleaseWizardCtrl', [
  '$scope', '$state', 'appsFactory', '$rootScope', '$interval', 'appInfoModal',
  function ($scope, $state, appsFactory, $rootScope, $interval, appInfoModal) {

    var template_base_path = 'ngapp/release-wizard/templates/';

    $rootScope.title = $state.current.title;
    $scope.isReleaseWizard = true;

    appsFactory.list(function (data) {
      $scope.apps = data;
    });

    appsFactory.getEnvs(function (data) {
      $scope.envs = data.Envs;
    });

    $scope.resetWizard = function () {
      $scope.tabs = [
        { index: 1, active: true, title: 'Step 1: App-Sha-Environments', template: template_base_path + 'release-step1.html', visited: false },
        { index: 2, active: false, title: 'Step 2: Container Settings', template: template_base_path + 'release-step2.html', visited: false },
        { index: 3, active: false, title: 'Step 3: Deploy Configuration', template: template_base_path + 'release-step3.html', visited: false },
        { index: 4, active: false, title: 'Step 4: Confirm', template: template_base_path + 'release-step4.html', visited: false },
        { index: 5, active: false, title: 'Step 5: Results', template: template_base_path + 'release-step5.html', visited: false }
      ];

      $scope.currentTab = _.first($scope.tabs);
      $scope.selectedEnvs = [];
      $scope.data = {};
      $scope.appBtnText = 'Select App';
      $scope.container_ram = 256;
      $scope.containers_per_zone = 1;
      $scope.cpu_shares = 1;
      $scope.shaToDeploy = '';
      $scope.deployedApps = {};
    };

    $scope.nextStep = function () {
      var record,
        deploy_messages = [],
        nextTab = $scope.tabs[$scope.currentTab.index];

      nextTab.active = true;
      $scope.currentTab.active = false;
      $scope.currentTab.visited = true;
      $scope.currentTab = nextTab;
      $scope.post_deploy_message = "No Action";

      if ($scope.deploy_success) {
        deploy_messages.push("Route traffic to newly pool");
      }
      if ($scope.notify_on_success) {
        deploy_messages.push("Email Notification");
      }
      if (deploy_messages.length > 0) {
        $scope.post_deploy_message = deploy_messages.join(', ');
      }

      if (nextTab.index === 5) {
        _.each($scope.selectedEnvs, function (env) {
          record = {
            DeployedRecord: {},
            Details: {
              App: $scope.selectedApp,
              Environment: env,
              Sha: $scope.shaToDeploy,
              RAM: $scope.container_ram,
              CPUShares: $scope.cpu_shares,
              ContainerPerZone: $scope.containers_per_zone,
              PostDeployMessage: $scope.post_deploy_message
            },
            DeployingContainers: [
            ],
            SanityChecks: {
              DependenciesFulfilled: true,
              JenkinsTestsPass: true
            },
            PostDeploy: {
              Type: 'Email Notification',
              isNotified: false
            }
          };
          $scope.data[env] = record;
        });
      }
    };

    $scope.randString = function (n) {
      n = n || 5;
      return Math.random().toString(36).substring(2, n + 2);
    };

    $scope.selectApp = function (appName) {
      $scope.appBtnText = $scope.selectedApp = appName;
    };

    $scope.selectEnv = function (env) {
      $scope.selectedEnvs.push(env);
    };

    $scope.goToDashboard = function () {
      $state.go('root.dashboard');
    };

    $scope.updateStatus = function (id, env) {
      var pollDeployStatus = $interval(function () {
        appsFactory.getTasks(id, function (data) {
          $scope.data[env].Result.data = data;
          if (data.Done) {
            $scope.data[env].Result.status = 'Deployed Successfully.';
            $scope.data[env].Result.class = 'text-success';
            $interval.cancel(pollDeployStatus);
          } else {
            if (data.Error) {
              $scope.data[env].Result.status = "Error: " + data.Error;
              $scope.data[env].Result.class = 'text-danger';
            } else {
              $scope.data[env].Result.status = data.Status;
              $scope.data[env].Result.class = 'text-info';
            }
          }
        }, function (error) {
          $scope.data[env].Result.status = "Error: " + error;
          $scope.data[env].Result.class = 'text-danger';
        });
      }, 5000, 12);
    };

    $scope.deployApp = function () {
      var options = {
        appName: $scope.selectedApp,
        sha: $scope.shaToDeploy,
        data: {
          CPUShares: $scope.cpu_shares.toString(),
          MemoryLimit: $scope.container_ram.toString(),
          Instances: $scope.containers_per_zone.toString(),
          Dev: false
        }
      };

      // deploying each environment
      _.each($scope.selectedEnvs, function (env) {
        options.env = env;
        appsFactory.deployApp(options, function (data) {
          $scope.data[env].DeployedRecord = data;
          $scope.data[env].Result = {
            status: 'Still Deploying ...',
            class: 'text-warning'
          };
          $scope.updateStatus(data['ID'], env);
        }, function (error) {
          alert('error');
        });
        $scope.nextStep();
      });
    };

    $scope.showDeployedAppInfo = function (app) {
      var templateUrl = template_base_path + 'app-info.html';
      appInfoModal.modalInstance(templateUrl, app.Result.data.Containers[0]);
    };

    $scope.deployAnotherApp = function () {
      $scope.resetWizard();
      $scope.currentTab = $scope.tabs[0];
      $scope.currentTab.active = true;
    };

    $scope.resetWizard();
  }]);
