
/*
//------------------------------------------------------------------------------ 
//        Date  2019-06-06
//        Author  蔡捷   
//			 				Applications 
//        File  application_admin.cshtml  Page file  
//        File  application_admin.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/application_admin.js
 Description Applications(application_admin)  js File 
*/
// Current page object 
var km = {};
km.init = function () {
}


app.controller('UserInfoModalInstanceControl', ['$scope', '$modalInstance', '$http', 'row', function ($scope, $modalInstance, $http, row) {

    $scope.DDLData = row.ddldata;
    $scope.loader = function (param) {
        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader + "&value=" + param.keyword);
    };
    $scope.row = row;
    console.log($scope.row);
    $scope.ok = function () {
        $modalInstance.close($scope.row);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



    function formatTime2(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ':00 ' + ampm;
        return strTime;
    }

    function formatDate(date) {
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    }
    //$scope.save = function () {
    //    $scope.row.scheduled_dt = formatDate(new Date($scope.row.date)) + " " + formatTime(new Date($scope.row.time));
    //    console.log($scope.row.scheduled_dt);
    //    $rootScope.$broadcast("Schedule" + $scope.row.EditType, $scope.row);
    //    $(".ScheduleDetailButtons").hide();
    //    $scope.row.editrow = false;
    //}
    //$scope.cancel = function () {

    //    $rootScope.$broadcast("ScheduleCancel", $scope.row);
    //    $(".ScheduleDetailButtons").hide();
    //    $scope.row = Object.assign({}, $scope.row_old);
    //    $scope.row.editrow = false;
    //}
    $scope.LocalTime = "";
    $scope.minDate = function () {
        $scope.dt = new Date();
    };

    $scope.today = function () {
        $scope.mydate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.mydate = null;
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

    $scope.initDate = new Date( );
    $scope.formats = ['MM/dd/yyyy','yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MMMM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];


    $scope.mytime = new Date('05/01/2019 6:00:00 am');

    $scope.mydate = formatDate(new Date());
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

        var dt = formatDate(new Date($scope.mydate)) + " " + formatTime2(new Date($scope.mytime));
       // console.log(dt);

        var d = new Date(dt);
        $scope.LocalTime = $scope.calcTime2(dt);
        $scope.row.scheduled_dt = new Date( new Date($scope.LocalTime) - (d.getTimezoneOffset() * 60000));
        console.log($scope.LocalTime );
        console.log($scope.row.scheduled_dt);
    };


    $scope.calcTime2 = function (dt) {
        var offset = $scope.row.time_zone_offset
        if (offset == undefined)
            return "";
        var d = new Date(dt);
       // console.log(d);
        var utc = d.getTime() - (3600000 * offset);

        var nd = new Date(utc - (d.getTimezoneOffset() * 60000));
       // console.log(nd);
        return nd.toLocaleString();

    }



    $scope.clear = function () {
        $scope.mytime = null;
    };
}])



//------------------------------------------------------------------------------ 
//        Date  2019-06-06
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  

app.controller('ApplicationsDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', '$interval', function ($scope, $rootScope, $stateParams, $modal, $http, $interval) {
    /*  var id = $stateParams.id;
      var number = $stateParams.number;
      console.log(id);
      console.log(number);
      */

    $scope.LocalTime = "";

    $interval(function () {
        $scope.LocalTime =  $scope.calcTime( );
         //   console.log($scope.row.time_zone_offset);
    }, 1000);

    $scope.calcTime = function ( ) {
        var offset = $scope.row.time_zone_offset
        if (offset == undefined)
            return "";
        var d = new Date();

        var  utc = d.getTime() + (d.getTimezoneOffset() * 60000);

       var nd = new Date(utc + (3600000 * offset));

        return nd.toLocaleString();

    }    /*  var id = $stateParams.id;
      var number = $stateParams.number;
      console.log(id);
      console.log(number);
      */


    $scope.openIframe = function (size, EditType) {
        var modalInstance = $modal.open({
            templateUrl: 'IframeDialog',
            controller: 'IframePopup',
            size: size,
            windowClass: 'my-modal',
            resolve: {
                parm: function () {
                    var r = { Title: "User Info", hight: 600, OkText: "Save", URL: "/home/admin?mc=admin&name=popup#/app/sm_user", HideOk: true }
                    return r;
                }
            }
        });

        modalInstance.result.then(function (row) {
            console.log(row);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.loader = function (param) {
        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader + "&value=" + param.keyword);
    };
    $scope.DDLData = km.ddls;
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
    $rootScope.$on("ApplicationsSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row);
        $scope.row_old = row;

        console.log($scope.row);
        $(".tmpHide").removeClass("tmpHide");

        $scope.ListSchedule();
    });
    $rootScope.$on("ApplicationsEditSide", function (event, row) {
        $scope.row = Object.assign({}, row);
        console.log($scope.row );
        $(".ApplicationsDetailButtons").show();
    });
    $scope.save = function () {
        $rootScope.$broadcast("Applications" + $scope.row.EditType, $scope.row);
        $(".MyLogDetailButtons").hide();
        $scope.row.editrow = false;
    }
    $scope.cancel = function () {

        $rootScope.$broadcast("ApplicationsCancel", $scope.row);
        $(".MyLogDetailButtons").hide();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }


    function formatTime(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }



    $scope.open = function (size, EditType) {
        var modalInstance = $modal.open({
            templateUrl: 'ScheduleDetail',
            controller: 'UserInfoModalInstanceControl',
            size: size,
            resolve: {
                row: function () {
                    $scope.row.EditType = EditType;
                    $scope.row.ddldata = $scope.DDLData

                    console.log($scope.row);
                    return $scope.row;
                }
            }
        });

        modalInstance.result.then(function (row) {


            //if (row.EditType == "Edit") {
            //    $scope.updateData(row)
            //}
            //if (row.EditType == "Insert") {
            //    $scope.insertData(row)
            //}
            row.data_id = row.id;
            row.active_flag = true;
            com.ajax({
                type: 'POST', url: km.model.urls["Schedule_insert"], data: row, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];

                        r.editrow = false;
                      //  $scope.afterInsert(r);
                    }
                    $scope.ListSchedule();
                //    $scope.showResult(result, "Insert");
                }
            });

        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    $scope.Data = [];
    $scope.ListSchedule = function () {
        com.ajax({
            type: 'POST', url: km.model.urls["schedule_application_list"], data: { application_id: $scope.row.id, user_id: $scope.row.user_id, schedule_type:"application" }, success: function (result) {
                $scope.Data = result;
            }
        });
    }
    $scope.InsertPopup = function () {

     //   var row = {};// $scope.copyEmptyObject($scope.row);
       // $scope.row = row;
        $scope.row.schedule_type = "Application";

        $scope.row.method = "phone";
        $scope.row.title = "Interview for application";
        $scope.row.CONTEXT = "Dear:";
        $scope.row.editrow = true;
        $scope.open('lg', 'Insert');

    }


}]);


//------------------------------------------------------------------------------ 
//        Date  2019-06-06
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  


function Applications_8_Init() {

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
    $rootScope.$on("ApplicationsSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row ); 
        $(".tmpHide").removeClass("tmpHide");
    });
    $scope.insert = function () {  
        $rootScope.$broadcast("ApplicationsInsert", $scope.row);
    };
    $scope.delete = function (id) {
        $rootScope.$broadcast("ApplicationsDelete", $scope.row.id, $scope.row.id);
    };
    $scope.update = function () {
        $rootScope.$broadcast("ApplicationsUpdate", $scope.row);
    }; 
    //$scope.$watch("row.ip", function (newValue, oldValue) {
    //    console.log("$watch:"+newValue); 
    //});

    $scope.ipchanged = function () {
        console.log("ipchanged:"+$scope.row.ip);
    }

});
*/




 

app.controller('ApplicationsCtrl', [
    '$scope', '$rootScope', '$http', '$modal', '$q', function ($scope, $rootScope, $http, $modal, $q) {
        $scope.SelectedRow = {};//for getting row detail
        $scope.row = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;




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
            $scope.ApplicationsgridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ApplicationsgridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ApplicationsgridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.InsertRowInline = function () {
            $scope.editType = "i";
            var row = $scope.copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.ApplicationsgridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ApplicationsgridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ApplicationsgridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.gridApi.grid.rows[0].inlineEdit.enterEditMode();
        }

        $scope.editRow = function (row) {
            $scope.editType = "u";
            var index = $scope.ApplicationsgridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.ApplicationsgridOptions.data[index].editrow = !$scope.ApplicationsgridOptions.data[index].editrow;
        };
        $scope.saveRow = function (row) {
            var index = $scope.ApplicationsgridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.ApplicationsgridOptions.data[index].editrow = !$scope.ApplicationsgridOptions.data[index].editrow;

            if ($scope.editType == "i") {
                $scope.insertData(row);
            } else
                $scope.updateData(row);
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            var index = $scope.ApplicationsgridOptions.data.indexOf(row);

            if ($scope.editType == "i") {
                $scope.ApplicationsridOptions.data.splice(0, 1);
            } else {

                if (index > 0) {
                    if (row != null) {
                        //  $scope.ApplicationsgridOptions.data.splice(0, 1);
                        var keys = Object.keys($scope.row);
                        keys.forEach(function (k) {
                            $scope.ApplicationsgridOptions.data[index][k] = $scope.row[k];
                        });
                        //Use that to set the editrow attrbute value to false
                        $scope.ApplicationsgridOptions.data[index].editrow = false;
                    }
                }
            }
            $scope.editType = "";
            $scope.SelectedRow.entity.editrow = false;
            $rootScope.$broadcast("SysToaster", 'info', "", "Row editing cancelled");
        };

        $scope.$on("ApplicationsUpdate", function (event, row) {
            $scope.updateData(row)
        });
        $scope.$on("ApplicationsInsert", function (event, row) {
            $scope.insertData(row);
        });
        $scope.$on("ApplicationsDelete", function (event, id, text) {
            $scope.deleteIt(id, text)
        });

        $scope.$on("ApplicationsCancel", function (event, row) {
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
                type: 'POST', url: km.model.urls["Applications_insert"], data: row, success: function (result) {
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
                $scope.ApplicationsgridOptions.data.splice(0, 1);
            }
            if ($scope.ApplicationsgridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.ApplicationsgridOptions.data.splice($scope.ApplicationsgridOptions.data.length - 1, 1);
            }
            $scope.editType = "";
            $scope.ApplicationsgridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ApplicationsgridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ApplicationsgridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
            $scope.ApplicationsgridOptions.totalItems = $scope.ApplicationsgridOptions.totalItems + 1;
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
                type: 'POST', url: km.model.urls["Applications_delete"], data: parms, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        $scope.afterDelete(r);
                    }
                    $scope.showResult(result, "Delete");
                }
            });
        }
        $scope.afterDelete = function (row) {
            if ($scope.ApplicationsgridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.ApplicationsgridOptions.data.push(row);
            }
            $scope.ApplicationsgridOptions.totalItems = $scope.ApplicationsgridOptions.totalItems - 1;
            $scope.ApplicationsgridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.ApplicationsgridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ApplicationsgridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.updateData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["Applications_update"], data: row, success: function (result) {
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
            $rootScope.$broadcast("ApplicationsSelectedRowChanged", $scope.row);
        };
        $scope.EditSide = function (row) {
            row.EditType = "Update";

            row.editrow = true;
            $scope.SelectedRow = row;
            row.editrow = true;
            $rootScope.$broadcast("ApplicationsEditSide", row);
        };
        $scope.InsertSide = function () {

            var row = $scope.copyEmptyObject($scope.row);
            row.EditType = "Insert";

            row.editrow = true;
            $rootScope.$broadcast("ApplicationsEditSide", row);
        };
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 30,
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


        $scope.ApplicationsgridOptions = {
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
                        field: 'real_name', displayName: 'User', width: 80, align: 'center',
                    },
                    {
                        field: 'add_on', displayName: 'Add On', width: 80, align: 'center',
                    },
                    {
                        field: 'first_name', displayName: 'First Name', width: 80, align: 'center',
                    },
                    {
                        field: 'last_name', displayName: 'Last Name', width: 80, align: 'center',
                    },
                    {
                        field: 'city', displayName: 'City', width: "*", align: 'center',
                    },
                    {
                        field: 'country', displayName: 'Country', width: 80, align: 'center',
                    },
                    {
                        field: 'gender', displayName: 'Gender', width: 80, align: 'center',
                        cellTemplate: "<div>{{grid.appScope.TranslateToText('m=Male f=Famle',row.entity.gender)}}</div>"
                    },
                    //{
                    //    field: 'education', displayName: 'Education', width: 80, align: 'center',
                    //    cellTemplate: "<div>{{grid.appScope.TranslateToText(grid.appScope.DDLData['education'],row.entity.education)}}</div>"
                  //  },
                    //{
                    //    field: 'experience', displayName: 'Experience', width: "*", align: 'center',
                    //},
                    //{
                    //    field: 'id', displayName: 'Id', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'ip', displayName: 'Ip', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'languages', displayName: 'Languages', width: 80, align: 'center',
                    //    cellTemplate: "<div>{{grid.appScope.TranslateToText(grid.appScope.DDLData['languages'],row.entity.languages)}}</div>"
                    //},
                    //{
                    //    field: 'middle_name', displayName: 'Middle Name', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'phone', displayName: 'Phone', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'state', displayName: 'State', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'teaching_years', displayName: 'Teaching Years', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'time_zone', displayName: 'Time Zone', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'time_zone_offset', displayName: 'Time Zone Offset', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'timezone_ip', displayName: 'Timezone Ip', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'user_id', displayName: 'User Id', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'where_info', displayName: 'Where Info', width: 80, align: 'center',
                    //},
                    //{
                    //    field: 'zip_ip', displayName: 'Zip Ip', width: 80, align: 'center',
                    //},
                    {
                        field: 'approve_flag', displayName: 'Approve Flag', width: 80, align: 'center',
                        cellTemplate: "<label class='i-switch m-t-xs m-r'> <input type='checkbox'   ng-disabled='true'  ng-model='row.entity.approve_flag' checked>  <i></i> </label>",
                    },
                    //{
                    //    field: 'comments', displayName: 'Comments', width: 80, align: 'center',
                    //},
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
                    $scope.selectedRowIndex = $scope.ApplicationsgridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
            }
        };

        $scope.getPage = function () {
            $http.get(km.model.urls["Applications_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order + "&approve_flag=" + '' + "&_t=" + com.settings.timestamp()).success(function (result) {

                    if (Array.isArray(result.rows)) {
                        result.rows.forEach(function (d) {
                            d.editrow = false;
                        });
                        $scope.ApplicationsgridOptions.data = result.rows;
                        $scope.GetIDS();

                    } else

                        $scope.ApplicationsgridOptions.totalItems = result.total;

                    $scope.gridApi.grid.modifyRows($scope.ApplicationsgridOptions.data);

                    if ($scope.ApplicationsgridOptions.data.length > 0)
                        $scope.gridApi.selection.selectRow($scope.ApplicationsgridOptions.data[0]);
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

            $.each($scope.ApplicationsgridOptions.data, function (index, item) {
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

