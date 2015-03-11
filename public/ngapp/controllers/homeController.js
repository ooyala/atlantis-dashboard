// var underscore = angular.module('underscore', []);
// underscore.factory('_', function() {
//   return window._; //Underscore must already be loaded on the page
// });
var myApp = angular.module('myApp', ['ui.router']);//, 'underscore']);

myApp.factory('datasvc', function(){
	var svc ={};
	svc.getData = function(item){
			var data = item;
			return data;
	}
	return svc;
});

myApp.controller('DemoController', ['$scope', '$http', function($scope, $http, datasvc) {
	$scope.active = true;
	$scope.hideData=[];
	$scope.selectedApp = {};
	$scope.Envs=[];

  $http.get('/envs').success(function(data){
		$scope.Env = data;
			$scope.display = function () {
     	return $scope.Hobbies = en.Hobbies;
 		}
	});

  $http.get('/apps').success(function(data){
		$scope.App = data;
		$scope.selectedApp = data;
	});

 	$scope.disp = function(){
 		console.log($scope.listOfEnvs)
 	}

	$scope.showDetail = function(data){
		debugger;
		console.log(" data in showDetail : ", data)
		$scope.item = datasvc.getData(data)
		console.log("data is : ", $scope.item)
	}
  $scope.getStatus = function(index){
  	return $scope.hideData[index] || false
 	}

	$scope.showPanel = function(index){
   	$scope.hideData[index]=true;
  }

	$scope.listOfEnvs = [];
	$scope.show = function (data) {
		console.log("show data : ", data)
 		$scope.listOfEnvs = data.Env;
	}
}]);


myApp.controller('DemoController2', ['$scope', '$http', 'datasvc',
	function($scope, $http, datasvc) {
		$scope.item = datasvc.currentItem;
	}
]);

myApp.directive("myEnv", function() {
	return {
		templateUrl : 'templates/env-template.html',
		controller: ["$scope", 'datasvc', function($scope, datasvc) {
			$scope.panel=true;

			datasvc.currentItem = $scope.item;

			$scope.setPanel = function(){
				$scope.panel = true;
				return $scope.panel
			}

			$scope.showDetails = function(data){
				$scope.item = data
				datasvc.currentItem = data;
				console.log("data is : ", datasvc.currentItem)
			}

			console.log("panel is : ",$scope.panel)
			$scope.hidePanel = function(){
 				$scope.panel = false;
 				console.log("hidePanel is : ",$scope.panel)
			};
		}],
	};
});

myApp.config(["$stateProvider", "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('dashboard');
		$stateProvider.state('page2',{
			url : '/page2',
			controller : 'DemoController2',
			templateUrl : 'index2.html'
		}).state('dashboard',{
			url : '/dashboard',
			controller : 'DemoController',
			templateUrl : 'dashboard.html'
		});
	}
]);

// filters
myApp.filter("titleize", function() {
  return function(str) {
  	if(str) {
	    var i, words, updated_words = [];
	    str = str.replace(/_/g, ' ');
	    words = str.split(' ');
	    for (i=0; i<words.length; ++i) {
	      updated_words.push(words[i].charAt(0).toUpperCase() + words[i].slice(1));
	    }
	    return updated_words.join(' ');
	  }
	  return '';
	};
});
