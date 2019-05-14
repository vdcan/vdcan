'use strict';

/**
 * Config for the router
 * 
 * popup
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
        ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
            function ($stateProvider, $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
          
          $urlRouterProvider
              .otherwise('/app/dashboard-v1');
          $stateProvider
                ###DETAIL###   

                .state('app', {
                    url: '/app',
                    templateUrl: '/tpl/popup.html',
                    resolve: load(["toaster"]),
                    cache: false
                })
                    .state('app.dashboard-v1', {
                        url: '/dashboard-v1',
                        templateUrl: '/tpl/app_dashboard_v1.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['/Javascripts/controllers/chart.js']);
                                }]
                        },
                        cache: false
                    })
                    .state('app.ui.pggrid', {
                        url: '/pggrid',
                        templateUrl: '/tpl/pggrid.html',
                        cache: false
                    })
                    .state('app.ui.pggrid2', {
                        url: '/pggrid2',
                        templateUrl: '/tpl/pggrid2.html',
                        cache: false
                    })
                    .state('app.ui.buttons', {
                        url: '/buttons',
                        templateUrl: '/tpl/ui_buttons.html',
                        cache: false
                    })
                    .state('app.ui', {
                        url: '/ui',
                        template: '<div ui-view class="fade-in-up"></div>',
                        templateUrl: '?menucode=yw6d',
                        cache: false
                    })
              .state('access', {
                    url: '/access',
                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                })
                 .state('access.signin', {
                    url: '/signin',
                    templateUrl: '/tpl/page_signin.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['/Javascripts/controllers/signin.js']);
                            }]
                    }
                })
                    .state('access.signup', {
                        url: '/signup',
                        templateUrl: '/tpl/page_signup.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['/Javascripts/controllers/signup.js']);
                                }]
                        }
                    })
                    .state('access.forgotpwd', {
                        url: '/forgotpwd',
                        templateUrl: '/tpl/page_forgotpwd.html'
                    })
                ;
          function load(srcs, callback) {
              return {
                  deps: ['$ocLazyLoad', '$q',
                      function ($ocLazyLoad, $q) {
                          var deferred = $q.defer();
                          var promise = false;
                          srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                          if (!promise) {
                              promise = deferred.promise;
                          }
                          angular.forEach(srcs, function (src) {
                              promise = promise.then(function () {
                                  if (JQ_CONFIG[src]) {
                                      return $ocLazyLoad.load(JQ_CONFIG[src]);
                                  }
                                  angular.forEach(MODULE_CONFIG, function (module) {
                                      if (module.name == src) {
                                          name = module.name;
                                      } else {
                                          name = src;
                                      }
                                  });
                                //  console.log(MODULE_CONFIG);
                                  return $ocLazyLoad.load(name);
                              });
                          });
                          deferred.resolve();
                          return callback ? promise.then(function () {
                              return callback();
                          }) : promise;
                      }]
              }
          }
      }
    ]
  );