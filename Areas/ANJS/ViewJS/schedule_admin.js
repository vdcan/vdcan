
/*
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			 				Schedule Admin 
//        File  schedule_admin.cshtml  Page file  
//        File  schedule_admin.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/schedule_admin.js
 Description Schedule Admin(schedule_admin)  js File 
*/
// Current page object 
var km = {}; 
km.init = function () {
}
 

app.controller('user_listCtrl', [
    '$scope', '$rootScope', '$http', '$modal', '$q', function ($scope, $rootScope, $http, $modal, $q) {
        $scope.SelectedRow = {};//for getting row detail
        $scope.row = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;
        $scope.sid = 0;

        $rootScope.$on("ScheduleSelectedRowChanged", function (event, row, ids, paginationOptions) {
            //$scope.row = Object.assign({}, row);
            //$scope.row_old = row;
            //$(".tmpHide").removeClass("tmpHide");
           
            $scope.sid = row.id;
            $scope.getPage();
            console.log($scope.sid);
        });


        $scope.loader = function (param) {
            return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader + "&value=" + param.keyword);
        };


        $scope.DDLData = km.ddls;
        $scope.getDDL = function (param) {
            // console.log(param);
            if (typeof $scope.DDLData == "undefined")
                $scope.DDLData = new Object();
            if ($scope.DDLData.hasOwnProperty(param))
                return $scope.DDLData[param];

            $http({
                method: 'GET',
                url: km.model.urls["ddler"] + "&ddl=" + param
            }).then(function successCallback(response) {
                //console.log(response.data);
                $scope.DDLData[param] = response.data;
                console.log($scope.DDLData);
                return $scope.DDLData[param];
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };



        $scope.sync = function () {
            $rootScope.$broadcast("user_listSelectedRowChanged", $scope.row);
        };
        $scope.EditSide = function (row) {
            row.EditType = "Update";

            row.editrow = true;
            $scope.SelectedRow = row;
            row.editrow = true;
            $rootScope.$broadcast("user_listEditSide", row);
        };
        $scope.InsertSide = function () {

            var row = $scope.copyEmptyObject($scope.row);
            row.EditType = "Insert";

            row.editrow = true;
            $rootScope.$broadcast("user_listEditSide", row);
        };
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            order: "desc",
            sort: "id",
        };
        $scope.TranslateToText = function (data, value) {

            var result = value;
            if (Array.isArray(data)) {
                data.forEach(function (d) {
                    if (d.id == value) {

                        result = d.text;
                        return;
                    }
                })
            } else {
                // console.log(data);
                var a = data.split(" ");
                for (var i = 0; i < a.length; i++) {

                    var v = a[i].split("=")[0];
                    var t = a[i].split("=")[1];

                    if (value == v)
                        return t;
                }

            }
            return result;
        }
        $scope.Translate = function (data, value, valcol, textcol) {
            var d = $scope.getDDL(data);
            var r = "";
            d.forEach(function (t) {
                if (t[valcol] == value)
                    r = t[textcol];
            });
            return r;
        };
        $scope.Check = function (row) {

            $scope.row = row
            com.ajax({
                type: 'POST', url: km.model.urls["check"], data: { sid: $scope.sid, user_id: row.user_id }, success: function (result) {
                    row.add_by = result.dt[0].add_by;
                    row.add_on = result.dt[0].add_on;
                    row.id = result.dt[0].id;
                   // $scope.showResult(result, "Checked");
                }
            });
        } 

        $scope.user_listgridOptions = {
            paginationPageSizes: [10, 15, 25, 50, 75],
            paginationPageSize: paginationOptions.pageSize,
            enableRowSelection: true,
            useExternalPagination: true,
            useExternalSorting: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            columnDefs:
                [
                    {
                        field: 'checked', displayName: '', width: 80, align: 'center',
                        cellTemplate: "<label class='i-switch m-t-xs m-r'> <input type='checkbox'  ng-click='grid.appScope.Check(row.entity)'    ng-model='row.entity.checked' checked>  <i></i> </label>",
                    },

                    {
                        field: 'real_name', displayName: 'User', width: 80, align: 'left',
                    },
                    {
                        field: 'add_by', displayName: 'Add By', width: "*", align: 'left',
                    },
                    {
                        field: 'add_on', displayName: 'Add On', width: "*", align: 'center',
                    },
                    {
                        field: 'id', displayName: 'Id', width: 80, align: 'center',
                    },
                    //{
                    //    field: 'schedule_id', displayName: 'Schedule Id', width: 80, align: 'center',
                    //},

                ],

            onRegisterApi: function (gridApi) {
                $scope.getPage();
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = "";
                    } else {
                        paginationOptions.order = sortColumns[0].sort.direction;
                        paginationOptions.sort = sortColumns[0].field;
                    }
                    $scope.getPage();
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                    $scope.getPage();
                });
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    // var msg = 'row selected ' + row.;
                    $scope.SelectedRow = row;
                    $scope.row = Object.assign({}, row.entity);
                    $scope.selectedRowIndex = $scope.user_listgridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
            }
        };

        $scope.getPage = function () {
            $http.get(km.model.urls["user_list_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order + "&schedule_id=" + $scope.sid + "&_t=" + com.settings.timestamp()).success(function (result) {

                    if (Array.isArray(result.rows)) {
                        result.rows.forEach(function (d) {
                            d.editrow = false;
                        });
                        $scope.user_listgridOptions.data = result.rows;
                        $scope.GetIDS();

                    }//else

                    $scope.user_listgridOptions.totalItems = result.total;

                    $scope.gridApi.grid.modifyRows($scope.user_listgridOptions.data);

                    if ($scope.user_listgridOptions.data.length > 0)
                        $scope.gridApi.selection.selectRow($scope.user_listgridOptions.data[0]);
                });
        }
        $scope.copyEmptyObject = function (source, isArray) {
            var o = Array.isArray(source) ? [] : {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    var t = typeof source[key];
                    o[key] = t == 'object' ? $scope.copyEmptyObject(source[key]) : { string: '', number: 0, boolean: false }[t];
                }
            }
            return o;
        }
        $scope.GetIDS = function () {
            var names = [];

            $.each($scope.user_listgridOptions.data, function (index, item) {
                names.push(item.id);
            });

            if (names.length == 0)
                $scope.ids = "0"
            else
                $scope.ids = names.join(",");
        }
        //  $scope.getPage();
    }
]);
   
 
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  
 
app.controller('ScheduleDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', function ($scope, $rootScope, $stateParams, $modal, $http) {
    /*  var id = $stateParams.id;
      var number = $stateParams.number;
      console.log(id);
      console.log(number);
      */
      
    $scope.loader = function (param) { 
        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader+"&value=" + param.keyword);
    };
    $scope.DDLData  = {};
    $scope.getDDL = function (param) {
        console.log(param);
        if (typeof $scope.DDLData == "undefined")
            $scope.DDLData = new Object();
        if ($scope.DDLData.hasOwnProperty(param))
            return $scope.DDLData[param];

        $http({
            method: 'GET',
            url: km.model.urls["ddler"] + "&ddl=" + param
        }).then(function successCallback(response) {
            //console.log(response.data);
            $scope.DDLData[param] = response.data;
        console.log($scope.DDLData);
            return $scope.DDLData[param];
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            }); 
    };
    $scope.row = {};// = {id:43124};
    $scope.row_old = {};// = {id:43124};
    //$scope.row_original = {};// = {id:43124};
    $rootScope.$on("ScheduleSelectedRowChanged", function (event, row, ids, paginationOptions) {

        row.CONTEXT = row.CONTEXT.replaceAll("&lt;", "<").replaceAll("&gt;", ">");

        row.date = row.scheduled_dt.split(" ")[0];
      row.time =new Date(  row.scheduled_dt );
        $scope.row = Object.assign({}, row);
        $scope.row_old = row;
        $(".tmpHide").removeClass("tmpHide");
    });    
    $rootScope.$on("ScheduleEditSide", function (event, row) {
        $scope.row = Object.assign({}, row);
        $(".ScheduleDetailButtons").show();
    }); 

    function formatTime(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return  strTime;
    }

    function formatDate(date) { 
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()  ;
    }
    $scope.save = function () { 
        $scope.row.scheduled_dt = formatDate( new Date( $scope.row.date)) + " " + formatTime( new Date($scope.row.time));
        console.log($scope.row.scheduled_dt );
        $rootScope.$broadcast("Schedule"+$scope.row.EditType, $scope.row);
        $(".ScheduleDetailButtons").hide(); 
        $scope.row.editrow = false;
    }
    $scope.cancel = function () { 
    	
        $rootScope.$broadcast("ScheduleCancel", $scope.row);
        $(".ScheduleDetailButtons").hide();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }

    $scope.minDate = function () {
        $scope.dt = new Date();
    };

    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    //$scope.disabled = function (date, mode) {
    //    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    //};

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MMMM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0]; 


    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    $scope.update = function () {
        var d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        $scope.mytime = d;
    };

    $scope.changed = function () {
        //console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function () {
        $scope.mytime = null;
    };



    
}]);  

 
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  
 
 
function  Schedule_8_Init(){ 
	
}


 
 
 

/*
//for other controllers to listen the selected row changed. 
app.controller('MainCtrl', function ($scope, $state, $stateParams, $rootScope) {
    var id = $stateParams.id;
    var number = $stateParams.number;
    console.log(id);
    console.log(number);
    id++;
    //console.log($scope);
    $scope.toDetails = function (product_id) {
     //   console.log(product_id);
        $state.go('app.about_aj', { id: id, number: 2 })
    }; 
    $scope.row = {};// = {id:43124};
    //$scope.row_original = {};// = {id:43124};
    $rootScope.$on("ScheduleSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row ); 
        $(".tmpHide").removeClass("tmpHide");
    });
    $scope.insert = function () {  
        $rootScope.$broadcast("ScheduleInsert", $scope.row);
    };
    $scope.delete = function (id) {
        $rootScope.$broadcast("ScheduleDelete", $scope.row.id, $scope.row.id);
    };
    $scope.update = function () {
        $rootScope.$broadcast("ScheduleUpdate", $scope.row);
    }; 
    //$scope.$watch("row.ip", function (newValue, oldValue) {
    //    console.log("$watch:"+newValue); 
    //});

    $scope.ipchanged = function () {
        console.log("ipchanged:"+$scope.row.ip);
    }

});
*/

       
 
app.controller('ScheduleCtrl', [
    '$scope', '$rootScope', '$http', '$modal','$q', function ($scope, $rootScope, $http, $modal,$q) {
        $scope.SelectedRow = {};//for getting row detail
        $scope.row = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;
        
        
	    $scope.loader = function (param) { 
	        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader+"&value=" + param.keyword);
	    };
	    
   
    $scope.DDLData = km.ddls;
    $scope.getDDL = function (param) {
       // console.log(param);
        if (typeof $scope.DDLData == "undefined")
            $scope.DDLData = new Object();
        if ($scope.DDLData.hasOwnProperty(param))
            return $scope.DDLData[param];

        $http({
            method: 'GET',
            url: km.model.urls["ddler"] + "&ddl=" + param
        }).then(function successCallback(response) {
            //console.log(response.data);
            $scope.DDLData[param] = response.data;
        console.log($scope.DDLData);
            return $scope.DDLData[param];
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            }); 
    	};
        

       
        $scope.editType = "";
        /*$scope.$on('$destroy', function () {
            console.log('Child1 is no longer necessary');
        })

        $scope.$on('test', function () {

            console.log('test' + counter); counter++;
        })*/
        $scope.InsertRow = function () {

            $scope.editType = "i";
            var row = $scope.copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.SchedulegridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.SchedulegridOptions.data);
             $scope.gridApi.selection.selectRow($scope.SchedulegridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
         $scope.InsertRowInline = function () { 
            $scope.editType = "i";
            var row = $scope.copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.SchedulegridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.SchedulegridOptions.data);
            $scope.gridApi.selection.selectRow($scope.SchedulegridOptions.data[0]);
            $scope.gridApi.core.refresh();
           $scope.gridApi.grid.rows[0].inlineEdit.enterEditMode(); 
        }
        
        $scope.editRow = function (row) {
            $scope.editType = "u";
            var index = $scope.SchedulegridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row); 
            //Use that to set the editrow attrbute value for seleted rows
            $scope.SchedulegridOptions.data[index].editrow = !$scope.SchedulegridOptions.data[index].editrow; 
        };
        $scope.saveRow = function (row) { 
            var index = $scope.SchedulegridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.SchedulegridOptions.data[index].editrow = !$scope.SchedulegridOptions.data[index].editrow; 
         
            if ($scope.editType == "i"){
                $scope.insertData(row);
            }else
                $scope.updateData(row);
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            var index = $scope.SchedulegridOptions.data.indexOf(row);

            if ($scope.editType == "i") {
                $scope.ScheduleridOptions.data.splice(0, 1);
            }else {
            
                if (index > 0) {
	                if (row != null) {
	                    //  $scope.SchedulegridOptions.data.splice(0, 1);
	                    var keys = Object.keys($scope.row);
	                    keys.forEach(function (k) {
	                        $scope.SchedulegridOptions.data[index][k] = $scope.row[k];
	                    });
	                    //Use that to set the editrow attrbute value to false
	                    $scope.SchedulegridOptions.data[index].editrow = false;
	                }
                }
            }
            $scope.editType = "";
            $scope.SelectedRow.entity.editrow = false;
            $rootScope.$broadcast("SysToaster", 'info', "", "Row editing cancelled");
        };
         
        $scope.$on("ScheduleUpdate", function (event, row) {
            $scope.updateData(row)
        });
        $scope.$on("ScheduleInsert", function (event, row) {
            $scope.insertData(row);
        });
        $scope.$on("ScheduleDelete", function (event, id, text) {
            $scope.deleteIt(id, text)
        });

        $scope.$on("ScheduleCancel", function (event, row) { 
            $scope.cancelEdit(row)
        });
        $scope.insert = function () {
            $scope.insertData($scope.row);
        };
        $scope.delete = function () {
            $scope.deleteIt($scope.row.id, $scope.row.id);
        };
        $scope.deleteInline = function (inline) {
             
            $scope.deleteIt(inline.id.value, inline.id.value);
        };
        $scope.update = function () {
            $scope.updateData($scope.row);
        };
        $scope.showResult = function (result, title) {
            if (result.s) {
                $rootScope.$broadcast("SysToaster", 'success', title, result.message);
            } else {
                $rootScope.$broadcast("SysToaster", 'error', title, result.message);
            }
        }
        $scope.insertData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["Schedule_insert"], data: row, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        
                        r.editrow = false;
                        $scope.afterInsert(r);
                    }
                    $scope.showResult(result, "Insert");
                }
            });
        }
        $scope.afterInsert = function (row) {
            if ($scope.editType == "i") {
                $scope.SchedulegridOptions.data.splice(0, 1);
            }
            if ($scope.SchedulegridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.SchedulegridOptions.data.splice($scope.SchedulegridOptions.data.length - 1, 1);
            }
            $scope.editType = "";
            $scope.SchedulegridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.SchedulegridOptions.data);
            $scope.gridApi.selection.selectRow($scope.SchedulegridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
            $scope.SchedulegridOptions.totalItems = $scope.SchedulegridOptions.totalItems + 1;
        }
        $scope.deleteIt = function (id, text) {
            var message = "Are you sure to delete";
            if (text == "")
                text = "it";
            message = message + " " + text + "?"
            var modalHtml = '<div class="modal-body">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

            var modalInstance = $modal.open({
                template: modalHtml,
                controller: ModalInstanceCtrl
            });
            modalInstance.result.then(function () {
                $scope.deleteData(id);
            });
        }
        $scope.deleteData = function (id) {
            var parms = { id: id, ids: $scope.ids, sort: paginationOptions.sort, order: paginationOptions.order }
            com.ajax({
                type: 'POST', url: km.model.urls["Schedule_delete"], data: parms, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        $scope.afterDelete(r);
                    }
                    $scope.showResult(result, "Delete");
                }
            });
        }
        $scope.afterDelete = function (row) {
            if ($scope.SchedulegridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.SchedulegridOptions.data.push(row);
            }
            $scope.SchedulegridOptions.totalItems = $scope.SchedulegridOptions.totalItems - 1;
            $scope.SchedulegridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.SchedulegridOptions.data);
            $scope.gridApi.selection.selectRow($scope.SchedulegridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.updateData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["Schedule_update"], data: row, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        
                        r.editrow = false;
                        var iterator = Object.keys(r);
                        for (let key of iterator) {
                            if (key.indexOf("$") < 0) {
                                $scope.SelectedRow.entity[key] = r[key];
                            }
                        }
                        $scope.afterUpdate();
                    }
                    $scope.showResult(result, "Update");
                }
            });
        }
        $scope.afterUpdate = function () {
            $scope.SelectedRow.entity.editrow = false;
            $scope.editType = "";
            $scope.gridApi.core.refresh();
        }
        
        $scope.sync = function () {
            $rootScope.$broadcast("ScheduleSelectedRowChanged", $scope.row );
        };
        $scope.EditSide = function (row) {
        		row.EditType ="Update";
        		
            row.editrow = true;
            $scope.SelectedRow = row;
            row.editrow = true;
            $rootScope.$broadcast("ScheduleEditSide", row );
        };
        $scope.InsertSide = function ( ) {
        		
            var row = $scope.copyEmptyObject($scope.row);
        		row.EditType ="Insert";
        		
            row.editrow = true;
            $rootScope.$broadcast("ScheduleEditSide", row );
        };
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 30,
            order: "desc",
            sort: "id",
        };
         $scope.TranslateToText = function (data, value) {

            var result=value;
            if (Array.isArray(data)) {
                data.forEach(function (d) {
                    if (d.id ==  value) {

                        result = d.text;
                    return;
                    }
                })
            } else {
            // console.log(data);
            var a = data.split(" ");
            for (var i = 0; i < a.length; i++) {

                var v = a[i].split("=")[0];
                var t = a[i].split("=")[1];

                if (value == v)
                    return t;
            }

            }
            return result;
        }
        $scope.Translate = function (data, value,valcol, textcol) {
				     var d= 	$scope.getDDL(data); 
				     var r ="";
        		d.forEach(function (t) {
                    if (t[valcol] == value)
                        r= t[textcol];
                });
                return r;
        };
        
        
        $scope.SchedulegridOptions = {
            paginationPageSizes: [10, 15, 25, 50, 75],
            paginationPageSize: paginationOptions.pageSize,
            enableRowSelection: true,
            useExternalPagination: true,
            useExternalSorting: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            columnDefs: 
                [ 
  { field: 'title', displayName: 'Title', width: "*", align: 'center',
    },
                 { field: 'active_flag', displayName: 'Active Flag', width: 80, align: 'center',
  cellTemplate:"<label class='i-switch m-t-xs m-r'> <input type='checkbox'   ng-disabled='true'  ng-model='row.entity.active_flag' checked>  <i></i> </label>",  },
  { field: 'add_by', displayName: 'Add By', width: 80, align: 'center',
    },
  { field: 'add_on', displayName: 'Add On', width: 80, align: 'center',
    },
  //{ field: 'comments', displayName: 'Comments', width: 80, align: 'center',
  //  },
  //{ field: 'CONTEXT', displayName: 'Context', width: 80, align: 'center',
  //  },
  //{ field: 'id', displayName: 'Id', width: 80, align: 'center',
  //  },
  { field: 'method', displayName: 'Method', width: 80, align: 'center',
  cellTemplate:"<div>{{grid.appScope.TranslateToText('phone=phone wechat=wechat netmeeting=netmeeting',row.entity.method)}}</div>"  },
  //{ field: 'schedule_type', displayName: 'Schedule Type', width: 80, align: 'center',
  //cellTemplate:"<div>{{grid.appScope.TranslateToText('interview=interview class=class meeting=meeting',row.entity.schedule_type)}}</div>"  },
  { field: 'scheduled_dt', displayName: 'Scheduled Dt', width: 80, align: 'center',
    },
 {
                        name: 'sActions ', field: 'edit', enableFiltering: false, enableSorting: false, enableColumnMenu: false,
                        cellTemplate: '<div><button  ng-show="!row.entity.editrow"   class="btn primary" ng-click="grid.appScope.EditSide(row.entity)"><ifa-edit"><i class="fa fa-edit"></i></button>' +  //Edit Button
                            '<button  ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.delete(row.entity.id)"><i class="fa fa-trash"></i></button>' +//Save Button
                                   '</div>', width: 80
                    }
  
                ],
                 
            onRegisterApi: function (gridApi) {
             $scope.getPage();
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = "";
                    } else {
                        paginationOptions.order = sortColumns[0].sort.direction;
                        paginationOptions.sort = sortColumns[0].field;
                    }
                    $scope.getPage();
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                    $scope.getPage();
                });
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    // var msg = 'row selected ' + row.;
                    $scope.SelectedRow = row;
                    $scope.row = Object.assign({}, row.entity);
                    $scope.selectedRowIndex = $scope.SchedulegridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
              }
        };
       
        $scope.getPage = function () {
            $http.get(km.model.urls["Schedule_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order +   "&_t="+com.settings.timestamp()).success(function (result) {
   
      if (Array.isArray(result.rows)) {
   	 								result.rows.forEach(function (d) {
                                                    d.editrow = false; 

                                                    d.CONTEXT = d.CONTEXT.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
                        });
                    $scope.SchedulegridOptions.data = result.rows;
                    $scope.GetIDS();

                    }else
                     
                    $scope.SchedulegridOptions.totalItems  = result.total; 
                    
                    $scope.gridApi.grid.modifyRows($scope.SchedulegridOptions.data);

                    if ($scope.SchedulegridOptions.data.length >0)
                        $scope.gridApi.selection.selectRow($scope.SchedulegridOptions.data[0]);
                });
        }
        $scope.copyEmptyObject =function(source, isArray) {
            var o = Array.isArray(source) ? [] : {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    var t = typeof source[key];
                    o[key] = t == 'object' ? $scope.copyEmptyObject(source[key]) : { string: '', number: 0, boolean: false }[t];
                }
            }
            return o;
        }
        $scope.GetIDS = function () {
            var names = [];

            $.each($scope.SchedulegridOptions.data, function (index, item) {
                names.push(item.id);
            });

            if (names.length == 0)
                $scope.ids = "0"
            else
                $scope.ids = names.join(",");
        }
      //  $scope.getPage();
    }
]);
 
