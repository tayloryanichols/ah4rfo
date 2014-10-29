'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate', 'ngCookies'])
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', 
    function(              $scope,   $translate,   $localStorage,   $window ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'Angulr',
        version: '1.3.1',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }])

  .controller('newVendor', ['$scope', 'appService', '$state', '$localStorage', '$cookieStore', 'permissions', function ($scope, appService, $state, $localStorage, $cookieStore, permissions) {
    $cookieStore.remove('query');
    $cookieStore.remove('page');
    var base = 'https://maintenance.ah4r.com/',
        app = 'ah4rvm/',
        location = 'getVendors.php',
        uri = ''+ base + app + location +'';

    appService.findNewVendors(uri).then(function(data) {
      $scope.newVendors = data.data;
      $localStorage.unapprovedVendors = JSON.stringify(data.data);
    });

  }])
  .controller('searchVendors', ['$scope', 'appService', '$state', '$localStorage', '$cookieStore', 'permissions', function ($scope, appService, $state, $localStorage, $cookieStore, permissions) {
    var base = 'https://maintenance.ah4r.com/',
        app = 'api/v1/',
        location = 'vendorSearch',
        uri = ''+ base + app + location +'', 
        count = '25';

    $scope.page = 1;
    $scope.search = function($i) {
      $i = $i || '1';
      $scope.page = $i;
      var url = encodeURI('' + uri + '?phrase=' + $scope.query + '&page='+ $i +'&count=' + count + '');
      console.log(url);
      appService.searchQuery(url).then(function(data) {

        var range = [];
        $scope.pages = data.data.pages;
        for(var i=0;i<data.data.pages;i++) {
          range.push(i);
        }
        $scope.range = range;
        $scope.pageResults = data.data;
        $scope.queryResults = data.data.vendors;

        $cookieStore.put('query', $scope.query);
        $cookieStore.put('page', $i);

        setTimeout(function() {
          $('html, body').animate({
              scrollTop: $('#startResults').offset().top
          }, 300);
        }, 100);

      });
    }

    console.log($cookieStore.get('query'));    
    if ($cookieStore.get('query')) {
      $scope.query = $cookieStore.get('query');
      var page = $cookieStore.get('page') || '1';
      console.log('query: '+ $scope.query);
      $scope.search(page);
    }    
  }])
  .controller('searchVendorRecords', ['$scope', 'appService', '$state', '$localStorage', '$cookieStore', 'permissions', '$stateParams', function ($scope, appService, $state, $localStorage, $cookieStore, permissions, $stateParams) {
    var base = 'https://maintenance.ah4r.com/',
        app = 'api/v1/',
        location = 'vendorDetails',
        uri = ''+ base + app + location +'',
        url = encodeURI('' + uri + '?id=' + $stateParams.vendor_id + '');
   
     appService.vendorDetails(url).then(function(data) {
       $scope.vendor = data.data;
       if($scope.vendor.details.dba_name != '' && $scope.vendor.details.dba_name != null) {
        $scope.vendorName = $scope.vendor.details.dba_name;
       } else {
        $scope.vendorName = $scope.vendor.details.vendor_name
       }

       if($scope.vendor.details.maintenance === "1" && $scope.vendor.details.construction === "1") {
        $scope.vendorType = 'Maintenance & Construction';
       } else if ($scope.vendor.details.maintenance === "0" && $scope.vendor.details.construction === "1") {
        $scope.vendorType = 'Construction Only';
       } else if ($scope.vendor.details.maintenance === "1" && $scope.vendor.details.construction === "0") {
        $scope.vendorType = 'Maintenance Only';
       } else {
        $scope.vendorType = '';
       }
     });

  }])
  // signin controller
  .controller('SigninFormController', ['$scope', '$http', '$state', '$localStorage', '$cookieStore', 'permissions', function($scope, $http, $state, $localStorage, $cookieStore, permissions) {
    $scope.user = {};
    $scope.authError = null;

    var user = $cookieStore.get('user_info')

    if(user != undefined){
      // Set Permissions
      
      if (permissions.hasPermission('approveVendors')) {
        $state.go('app.approveVendors');
      } else {
        $state.go('app.page.search');
      }
    }

    $scope.login = function() {
      $scope.authError = null;

      // Encript
      var encrypted = CryptoJS.AES.encrypt($scope.user.password, "1234");
      var decrypted = CryptoJS.AES.decrypt(encrypted, "1234");
      var originalData = decrypted.toString(CryptoJS.enc.Utf8);
      console.log(encrypted);
      console.log(decrypted);
      console.log(originalData);

      // Try to login
      $http.get('api/login', {email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = 'Email or Password not right';
        }else{

          var user = {id: 'john', permissions: ['approveVendors']};
          // Set a flag that we've logged in
          $cookieStore.put('auth', true);
          $cookieStore.put('user_info', user); 

          $state.go('app.approveVendors');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])

  // signup controller
  .controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      $http.post('api/signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = response;
        }else{
          $state.go('app.dashboard-v1');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
  // tab controller
  .controller('CustomTabController', ['$scope', function($scope) {
    $scope.tabs = [true, false, false];
    $scope.tab = function(index){
      angular.forEach($scope.tabs, function(i, v) {
        $scope.tabs[v] = false;
      });
      $scope.tabs[index] = true;
    }
  }])
 ;