var directives = angular.module('atlantisApp.homeDirectives', []);

directives.directive("envDepedency", function() {
  return {
    templateUrl : 'ngapp/templates/dependencies.html',
    controller: ["$scope", 'appsFactory', function($scope, appsFactory) {
      appsFactory.currentEnv = $scope.env;
    }],
  };
});

directives.directive('draggable', function() {
  return function(scope, element) {
      var el = element[0];

      el.draggable = true;

      el.addEventListener('dragstart', function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.clearData('Text');
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      }, false);

      el.addEventListener('dragend', function(e) {
        this.classList.remove('drag');
        return false;
      }, false);
    }
});

directives.directive('droppable', function() {
  return {
    scope: {
      drop: '&',
    },
    link: function(scope, element, attributes) {
      var el = element[0];
      el.addEventListener('dragover', function(e) {
        e.dataTransfer.dropEffect = 'move';
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        this.classList.add('over');
        return false;
      }, false);

      el.addEventListener('dragenter', function(e) {
        this.classList.add('over');
        return false;
      }, false);

      el.addEventListener('dragleave', function(e) {
        this.classList.remove('over');
        return false;
      }, false);

      el.addEventListener('drop', function(e) {
        if (e.stopPropagation) e.stopPropagation(); // Stops some browsers from redirecting.
        this.classList.remove('over');

        var item = document.getElementById(e.dataTransfer.getData('Text'));
        this.appendChild(item);

        scope.$apply('drop()');

        return false;
      }, false);
    }
  }
});
