var filters = angular.module('atlantisApp.statusFilters', []);

filters.filter('unique', function () {
  return function (collection, keyname) {
    var output = [],
      keys = [];
    angular.forEach(collection, function (item) {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});

filters.filter('limitedSha', function () {
  return function (collection) {
    var output = [];
    angular.forEach(collection, function (item) {
      item.Sha = item.Sha.substr(0, 6);
      if (output.indexOf(item.Sha) === -1) {
        output.push(item.Sha);
      }
    });
    return output;
  };
});
