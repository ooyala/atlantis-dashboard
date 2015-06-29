var filters = angular.module('atlantisApp.filters', []);

filters.filter("titleize", function() {
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
