'use strict';

/**
 * Config for the router
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
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('/access/signin');
          $stateProvider
           
              .state('access', {
                  url: '/access', templateUrl: '/tpl/app_step.html'

              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: '/tpl/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/Javascripts/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.signup', {
                  url: '/signup',
                  templateUrl: '/tpl/page_signup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/Javascripts/controllers/signup.js'] );
                      }]
                  }
              })

              .state('access.step1', {
                  url: '/step1',
                  templateUrl: '/tpl/page_step1.html',
                  resolve: {
                      deps: ['uiLoad',
                          function (uiLoad) {
                              return uiLoad.load(['/Javascripts/controllers/signup.js']);
                          }]
                  }
              })

              .state('access.step2', {
                  url: '/step2',
                  templateUrl: '/tpl/page_step2.html',
                  resolve: {
                      deps: ['uiLoad',
                          function (uiLoad) {
                              return uiLoad.load(['/Javascripts/controllers/signup.js']);
                          }]
                  }
              })
              .state('access.step3', {
                  url: '/step3',
                  templateUrl: '/tpl/page_step3.html',
                  resolve: {
                      deps: ['uiLoad',
                          function (uiLoad) {
                              return uiLoad.load(['/Javascripts/controllers/signup.js']);
                          }]
                  }
              })

              .state('access.step4', {
                  url: '/step4',
                  templateUrl: '/tpl/page_step4.html',
                  resolve: {
                      deps: ['uiLoad',
                          function (uiLoad) {
                              return uiLoad.load(['/Javascripts/controllers/signup.js']);
                          }]
                  }
              })

              .state('access.step5', {
                  url: '/step5',
                  templateUrl: '/tpl/page_step5.html',
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
              .state('access.404', {
                  url: '/404',
                  templateUrl: '/tpl/page_404.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  templateUrl: '/tpl/app_calendar.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            ['vendor/jquery/fullcalendar/fullcalendar.css',
                              'vendor/jquery/fullcalendar/theme.css',
                              'vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                              'vendor/libs/moment.min.js',
                              'vendor/jquery/fullcalendar/fullcalendar.min.js',
                              '/Javascripts/app/calendar/calendar.js']
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
              })

              // mail
              .state('app.mail', {
                  abstract: true,
                  url: '/mail',
                  templateUrl: '/tpl/mail.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/Javascripts/app/mail/mail.js',
                                               '/Javascripts/app/mail/mail-service.js',
                                               '/Javascripts/vendor/libs/moment.min.js'] );
                      }]
                  }
              })
              .state('app.mail.list', {
                  url: '/inbox/{fold}',
                  templateUrl: '/tpl/mail.list.html'
              })
              .state('app.mail.detail', {
                  url: '/{mailId:[0-9]{1,4}}',
                  templateUrl: '/tpl/mail.detail.html'
              })
              .state('app.mail.compose', {
                  url: '/compose',
                  templateUrl: '/tpl/mail.new.html'
              })

              .state('layout', {
                  abstract: true,
                  url: '/layout',
                  templateUrl: '/tpl/layout.html'
              })
              .state('layout.fullwidth', {
                  url: '/fullwidth',
                  views: {
                      '': {
                          templateUrl: '/tpl/layout_fullwidth.html'
                      },
                      'footer': {
                          templateUrl: '/tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/Javascripts/controllers/vectormap.js'] );
                      }]
                  }
              })
              .state('layout.mobile', {
                  url: '/mobile',
                  views: {
                      '': {
                          templateUrl: '/tpl/layout_mobile.html'
                      },
                      'footer': {
                          templateUrl: '/tpl/layout_footer_mobile.html'
                      }
                  }
              })
              .state('layout.app', {
                  url: '/app',
                  views: {
                      '': {
                          templateUrl: '/tpl/layout_app.html'
                      },
                      'footer': {
                          templateUrl: '/tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/Javascripts/controllers/tab.js'] );
                      }]
                  }
              })
              .state('apps', {
                  abstract: true,
                  url: '/apps',
                  templateUrl: '/tpl/layout.html'
              })
              .state('apps.note', {
                  url: '/note',
                  templateUrl: '/tpl/apps_note.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/Javascripts/app/note/note.js',
                                               'vendor/libs/moment.min.js'] );
                      }]
                  }
              })
              .state('apps.contact', {
                  url: '/contact',
                  templateUrl: '/tpl/apps_contact.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['/Javascripts/app/contact/contact.js'] );
                      }]
                  }
              })
              .state('app.weather', {
                  url: '/weather',
                  templateUrl: '/tpl/apps_weather.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(
                              {
                                  name: 'angular-skycons',
                                  files: ['/Javascripts/app/weather/skycons.js',
                                          'vendor/libs/moment.min.js', 
                                          '/Javascripts/app/weather/angular-skycons.js',
                                          '/Javascripts/app/weather/ctrl.js' ] 
                              }
                          );
                      }]
                  }
              })
              .state('music', {
                  url: '/music',
                  templateUrl: '/tpl/music.html',
                  controller: 'MusicCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load([
                            'com.2fdevs.videogular', 
                            'com.2fdevs.videogular.plugins.controls', 
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'com.2fdevs.videogular.plugins.buffering',
                            '/Javascripts/app/music/ctrl.js', 
                            '/Javascripts/app/music/theme.css'
                          ]);
                      }]
                  }
              })
                .state('music.home', {
                    url: '/home',
                    templateUrl: '/tpl/music.home.html'
                })
                .state('music.genres', {
                    url: '/genres',
                    templateUrl: '/tpl/music.genres.html'
                })
                .state('music.detail', {
                    url: '/detail',
                    templateUrl: '/tpl/music.detail.html'
                })
                .state('music.mtv', {
                    url: '/mtv',
                    templateUrl: '/tpl/music.mtv.html'
                })
                .state('music.mtvdetail', {
                    url: '/mtvdetail',
                    templateUrl: '/tpl/music.mtv.detail.html'
                })
                .state('music.playlist', {
                    url: '/playlist/{fold}',
                    templateUrl: '/tpl/music.playlist.html'
                })
      }
    ]
  );