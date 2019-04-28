// lazyload config

angular.module('app')
     
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   ['/Javascripts/vendor/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
      sparkline:      ['/Javascripts/vendor/jquery/charts/sparkline/jquery.sparkline.min.js'],
      plot:           ['/Javascripts/vendor/jquery/charts/flot/jquery.flot.min.js', 
                          '/Javascripts/vendor/jquery/charts/flot/jquery.flot.resize.js',
                          '/Javascripts/vendor/jquery/charts/flot/jquery.flot.tooltip.min.js',
                          '/Javascripts/vendor/jquery/charts/flot/jquery.flot.spline.js',
                          '/Javascripts/vendor/jquery/charts/flot/jquery.flot.orderBars.js',
                          '/Javascripts/vendor/jquery/charts/flot/jquery.flot.pie.min.js'],
      slimScroll:     ['/Javascripts/vendor/jquery/slimscroll/jquery.slimscroll.min.js'],
      sortable:       ['/Javascripts/vendor/jquery/sortable/jquery.sortable.js'],
      nestable:       ['/Javascripts/vendor/jquery/nestable/jquery.nestable.js',
                          '/Javascripts/vendor/jquery/nestable/nestable.css'],
      filestyle:      ['/Javascripts/vendor/jquery/file/bootstrap-filestyle.min.js'],
      slider:         ['/Javascripts/vendor/jquery/slider/bootstrap-slider.js',
                          '/Javascripts/vendor/jquery/slider/slider.css'],
      chosen:         ['/Javascripts/vendor/jquery/chosen/chosen.jquery.min.js',
                          '/Javascripts/vendor/jquery/chosen/chosen.css'],
      TouchSpin:      ['/Javascripts/vendor/jquery/spinner/jquery.bootstrap-touchspin.min.js',
                          '/Javascripts/vendor/jquery/spinner/jquery.bootstrap-touchspin.css'],
      wysiwyg:        ['/Javascripts/vendor/jquery/wysiwyg/bootstrap-wysiwyg.js',
                          '/Javascripts/vendor/jquery/wysiwyg/jquery.hotkeys.js'],
      dataTable:      ['/Javascripts/vendor/jquery/datatables/jquery.dataTables.min.js',
                          '/Javascripts/vendor/jquery/datatables/dataTables.bootstrap.js',
                          '/Javascripts/vendor/jquery/datatables/dataTables.bootstrap.css'],
      vectorMap:      ['/Javascripts/vendor/jquery/jvectormap/jquery-jvectormap.min.js', 
                          '/Javascripts/vendor/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                          '/Javascripts/vendor/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                          '/Javascripts/vendor/jquery/jvectormap/jquery-jvectormap.css'],
      footable:       ['/Javascripts/vendor/jquery/footable/footable.all.min.js',
                          '/Javascripts/vendor/jquery/footable/footable.core.css'] 
     }
)
    .constant('MODULE_CONFIG', [
        {
            name: 'uiGrid',
            files: [
                '/Javascripts/vendor/angular/angular-animate/angular-animate.js',
                '/Javascripts/vendor/modules/ui-grid/ui-grid.min.js',
                '/Javascripts/vendor/modules/ui-grid/ui-grid.min.css'
            ]
        },
        {
            name: 'ngGrid2',
            files: [
                '/Javascripts/vendor/modules/ng-grid/ng-grid.min.js',
                '/Javascripts/vendor/modules/ng-grid/ng-grid.min.css',
                '/Javascripts/vendor/modules/ng-grid/theme.css'
            ]
        },
        {
            name: 'ngGrid',
            files: [
                '/Javascripts/vendor/modules/ng-grid/ng-grid.min.js',
                '/Javascripts/vendor/modules/ng-grid/ng-grid.min.css',
                '/Javascripts/vendor/modules/ng-grid/theme.css'
            ]
        },
                     {
                  name: 'ui.select',
                  files: [
                      '/Javascripts/vendor/modules/angular-ui-select/select.min.js',
                      '/Javascripts/vendor/modules/angular-ui-select/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    '/Javascripts/vendor/modules/angular-file-upload/angular-file-upload.min.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['/Javascripts/vendor/modules/angular-ui-calendar/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      '/Javascripts/vendor/modules/ngImgCrop/ng-img-crop.js',
                      '/Javascripts/vendor/modules/ngImgCrop/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      '/Javascripts/vendor/modules/angular-bootstrap-nav-tree/abn_tree_directive.js',
                      '/Javascripts/vendor/modules/angular-bootstrap-nav-tree/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      '/Javascripts/vendor/modules/angularjs-toaster/toaster.js',
                      '/Javascripts/vendor/modules/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      '/Javascripts/vendor/modules/textAngular/textAngular-sanitize.min.js',
                      '/Javascripts/vendor/modules/textAngular/textAngular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      '/Javascripts/vendor/modules/angular-slider/angular-slider.min.js',
                      '/Javascripts/vendor/modules/angular-slider/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular',
                  files: [
                      '/Javascripts/vendor/modules/videogular/videogular.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      '/Javascripts/vendor/modules/videogular/plugins/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      '/Javascripts/vendor/modules/videogular/plugins/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.overlayplay',
                  files: [
                      '/Javascripts/vendor/modules/videogular/plugins/overlay-play.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      '/Javascripts/vendor/modules/videogular/plugins/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      '/Javascripts/vendor/modules/videogular/plugins/ima-ads.min.js'
                  ]
              }
    ]
).config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function ($ocLazyLoadProvider, MODULE_CONFIG) {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: MODULE_CONFIG
    });
}])
    

  //// oclazyload config
  //.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
  //    // We configure ocLazyLoad to use the lib script.js as the async loader
  //    $ocLazyLoadProvider.config({
  //        debug:  false,
  //        events: true,
  //        modules: [{
  //        	 name: 'pggrid2',
  //        	    files:   ['/css/jquery-ui.css',          	    
  //        	    '/Javascripts/jquery-ui.min.js',
  //        	    '/css/pqgrid.min.css',
  //        	    '/Javascripts/pqgrid.min.js',
  //        	    '/css/pqgrid.css']
    
  //        	},
  //            {
  //                name: 'ngGrid2',
  //                files: [
  //                    '/Javascripts/vendor/modules/ng-grid/ng-grid.min.js',
  //                    '/Javascripts/vendor/modules/ng-grid/ng-grid.min.css',
  //                    '/Javascripts/vendor/modules/ng-grid/theme.css'
  //                ]
  //            },
  //            {
  //                name: 'uiGrid2',
  //                files: [
  //                    '/Javascripts/vendor/modules/ui-grid/ui-grid.min.js',
  //                    '/Javascripts/vendor/modules/ui-grid/ui-grid.min.css',

  //                ]
  //            },
  //            {
  //                name: 'agGrid',
  //                files: [
  //                    '/Javascripts/ag-grid-enterprise.min.js' 
  //                ]
  //            },
  //            {
  //                name: 'ui.select',
  //                files: [
  //                    '/Javascripts/vendor/modules/angular-ui-select/select.min.js',
  //                    '/Javascripts/vendor/modules/angular-ui-select/select.min.css'
  //                ]
  //            },
  //            {
  //                name:'angularFileUpload',
  //                files: [
  //                  '/Javascripts/vendor/modules/angular-file-upload/angular-file-upload.min.js'
  //                ]
  //            },
  //            {
  //                name:'ui.calendar',
  //                files: ['/Javascripts/vendor/modules/angular-ui-calendar/calendar.js']
  //            },
  //            {
  //                name: 'ngImgCrop',
  //                files: [
  //                    '/Javascripts/vendor/modules/ngImgCrop/ng-img-crop.js',
  //                    '/Javascripts/vendor/modules/ngImgCrop/ng-img-crop.css'
  //                ]
  //            },
  //            {
  //                name: 'angularBootstrapNavTree',
  //                files: [
  //                    '/Javascripts/vendor/modules/angular-bootstrap-nav-tree/abn_tree_directive.js',
  //                    '/Javascripts/vendor/modules/angular-bootstrap-nav-tree/abn_tree.css'
  //                ]
  //            },
  //            {
  //                name: 'toaster',
  //                files: [
  //                    '/Javascripts/vendor/modules/angularjs-toaster/toaster.js',
  //                    '/Javascripts/vendor/modules/angularjs-toaster/toaster.css'
  //                ]
  //            },
  //            {
  //                name: 'textAngular',
  //                files: [
  //                    '/Javascripts/vendor/modules/textAngular/textAngular-sanitize.min.js',
  //                    '/Javascripts/vendor/modules/textAngular/textAngular.min.js'
  //                ]
  //            },
  //            {
  //                name: 'vr.directives.slider',
  //                files: [
  //                    '/Javascripts/vendor/modules/angular-slider/angular-slider.min.js',
  //                    '/Javascripts/vendor/modules/angular-slider/angular-slider.css'
  //                ]
  //            },
  //            {
  //                name: 'com.2fdevs.videogular',
  //                files: [
  //                    '/Javascripts/vendor/modules/videogular/videogular.min.js'
  //                ]
  //            },
  //            {
  //                name: 'com.2fdevs.videogular.plugins.controls',
  //                files: [
  //                    '/Javascripts/vendor/modules/videogular/plugins/controls.min.js'
  //                ]
  //            },
  //            {
  //                name: 'com.2fdevs.videogular.plugins.buffering',
  //                files: [
  //                    '/Javascripts/vendor/modules/videogular/plugins/buffering.min.js'
  //                ]
  //            },
  //            {
  //                name: 'com.2fdevs.videogular.plugins.overlayplay',
  //                files: [
  //                    '/Javascripts/vendor/modules/videogular/plugins/overlay-play.min.js'
  //                ]
  //            },
  //            {
  //                name: 'com.2fdevs.videogular.plugins.poster',
  //                files: [
  //                    '/Javascripts/vendor/modules/videogular/plugins/poster.min.js'
  //                ]
  //            },
  //            {
  //                name: 'com.2fdevs.videogular.plugins.imaads',
  //                files: [
  //                    '/Javascripts/vendor/modules/videogular/plugins/ima-ads.min.js'
  //                ]
  //            }
  //        ]
  //    });
  //}])
;