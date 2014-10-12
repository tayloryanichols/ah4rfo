'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])
	.factory('appService', function($q, $http){
		return {
			findNewVendors: function(uri) {
			    var deferred = $q.defer();
			    var getDetails = $http.get(uri);
			    deferred.resolve(getDetails);
			    return deferred.promise;
			}
		}
	});
