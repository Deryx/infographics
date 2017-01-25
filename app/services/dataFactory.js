(function() {
    var dataFactory = function($http) {
        var factory = {};

        factory.getData = function(file) {
            return $http.get(file);
        };

        return factory;
    };

    dataFactory.$inject = ['$http'];

    angular.module('infographicsApp')
        .factory('dataFactory', dataFactory);
})();