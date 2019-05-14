'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', 
    function(              $scope,   $translate,   $localStorage,   $window ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'My Website',
        version: '1.3.3',
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

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

        }]);



//added by Jerry Cai 
app.controller('SysToasterCtrl', ['$scope', 'toaster', '$rootScope', function ($scope, toaster, $rootScope) {
    $scope.toaster = {
        type: 'success',
        title: 'Title',
        text: 'Message'
    };
    //info  wait warning error success
    $scope.pop = function () {
        toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
    };

    $rootScope.$on("SysToaster", function (event, type, title, text) {
        toaster.pop(type, title, text);
    });
}]);




var ModalInstanceCtrl = function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
app.service('ControllerChecker', ['$controller', function ($controller) {
    return {
        exists: function (controllerName) {
                console.log($controller);
            if (typeof window[controllerName] == 'function') {

                console.log("t1");
                return true;
            }
            try {
                $controller(controllerName);

                console.log("t2");
                return true;
            } catch (error) {
                console.log(error);
                return !(error instanceof TypeError);
            }
        }
    };
}]);



app.controller('IframePopup', ['$scope', '$modalInstance', '$http', 'parm', function ($scope, $modalInstance, $http, parm) {
    $scope.Title = "Title";
    $scope.hight = "200";

    $scope.HideOk = false;
    $scope.HideClose = false;

    $scope.OkText = "OK";
    $scope.CloseText = "Close";

    for (var prop in parm) {
        $scope[prop] = parm[prop];
    }



    $scope.parm = parm;

    $scope.ok = function () {
        $modalInstance.close($scope.parm);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])




//app.config(['$provide', function ($provide) {
//    $provide.delegate('$controller', ['$delegate', function ($delegate) {
//        $delegate.exists = function (controllerName) {
//            try {
//                // inject '$scope' as a dummy local variable
//                // and flag the $controller with 'later' to delay instantiation
//                $delegate(controllerName, { '$scope': {} }, true);
//                return true;
//            }
//            catch (ex) {
//                return false;
//            }
//        };

//        return $delegate;
//    }]);
//}]);