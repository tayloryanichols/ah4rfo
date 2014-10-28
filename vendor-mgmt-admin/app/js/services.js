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
			},
			searchQuery: function(uri) {
				var deferred = $q.defer();
				var getResults = $http.get(uri);
				deferred.resolve(getResults);
				return deferred.promise;
			}
		}
	})
	.factory('permissions', ['$rootScope', '$cookieStore', '$q', function ($rootScope, $cookieStore, $q) {
    	var permissionList;
	    return {
	      setPermissions: function(permissions) {
	      	if ($cookieStore.get('user_info')) {
	      		permissionList = $cookieStore.get('user_info').permissions;
	      	} else {
	      		permissionList = [];
	      	}
	        
	        console.log(permissionList);
	        $rootScope.$broadcast('permissionsChanged')
	      },
	      hasPermission: function (permission) {
	      	console.log(permission);
	        permission = permission.trim();

	        var checkPermissions = function(p) {
	        	console.log(p);
	        	return permissionList.some(function(item) {
	        		console.log(item);
				    var value = (item.trim() === p) ? true : false;
		    		console.log('value: '+ value);
		    		return value;
		    	}); 
		    }

		    return checkPermissions(permission);

	      }
	    };
    }]);
