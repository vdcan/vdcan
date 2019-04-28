var km = {};
km.model = null; 
km.init = function () { 
}



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
    $rootScope.$on("MyLogSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row);
        $(".tmpHide").removeClass("tmpHide");
    });
    $scope.insert = function () {
        $rootScope.$broadcast("MyLogInsert", $scope.row);
    };
    $scope.delete = function (id) {
        $rootScope.$broadcast("MyLogDelete", $scope.row.id, $scope.row.id);
    };
    $scope.update = function () {
        $rootScope.$broadcast("MyLogUpdate", $scope.row);
    };
    //$scope.$watch("row.ip", function (newValue, oldValue) {
    //    console.log("$watch:"+newValue); 
    //});

    $scope.ipchanged = function () {
        console.log("ipchanged:" + $scope.row.ip);
    }

});
 



app.controller('MyLogCtrl', [
    '$scope', '$rootScope', '$http', '$modal', '$controller', function ($scope, $rootScope, $http, $modal, $controller) {

      //  console.log($controller.exists('TestController') ? 'Exists' : 'Does not exist');
      //  console.log($controller);


        $scope.SelectedRow = {};//for getting row detail
        $scope.CurrentRow = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;

        $rootScope.$on("MyLogUpdate", function (event, row) {
            updateData(row)
        });
        $rootScope.$on("MyLogInsert", function (event, row) {
            insertData(row);
        });
        $rootScope.$on("MyLogDelete", function (event, id, text) {
            deleteIt(id, text)
        });

        $scope.insert = function () {
            insertData($scope.CurrentRow);
        };
        $scope.delete = function () {
            deleteIt($scope.SelectedRow.id, $scope.SelectedRow.ip);
        };
        $scope.update = function () {
            updateData($scope.CurrentRow);
        };

        showResult = function (result, title) {
            if (result.s) {
                $rootScope.$broadcast("SysToaster", 'success', title, result.message);
            } else {
                $rootScope.$broadcast("SysToaster", 'error', title, result.message);
            }
        }
        insertData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["MyLog_insert"], data: row, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        afterInsert(r);
                    }
                    showResult(result, "Insert");
                }
            });
        }
        afterInsert = function (row) {
            $scope.gridOptions.data.unshift(row);
            $scope.gridOptions.data.splice($scope.gridOptions.data.length - 1, 1);
            $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
            $scope.gridApi.core.refresh();
            GetIDS();
        }
        deleteIt = function (id, text) {
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
                deleteData(id);
            });
        }
        deleteData = function (id) {
            var parms = { id: id, ids: $scope.ids, sort: paginationOptions.sort, order: paginationOptions.order }
            console.log(parms);
            com.ajax({
                type: 'POST', url: km.model.urls["MyLog_delete"], data: parms, success: function (result) {
                    if (result.s) {

                        var r = result.dt[0];
                        afterDelete(r);
                    }
                    showResult(result, "Delete");
                }
            });
        }
        afterDelete = function (row) {
            $scope.gridOptions.data.push(row);
            $scope.gridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
            $scope.gridApi.core.refresh();
            GetIDS();
        }
        updateData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["MyLog_update"], data: row, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        var iterator = Object.keys(r);
                        for (let key of iterator) {
                            if (key.indexOf("$") < 0) {
                                $scope.SelectedRow.entity[key] = r[key];
                            }
                        }
                        afterUpdate();
                    }
                    showResult(result, "Update");
                }
            });
        }
        afterUpdate = function () {
            console.log($scope.SelectedRow);
            $scope.gridApi.core.refresh();
        }
        $scope.sync = function () {
            $rootScope.$broadcast("MyLogSelectedRowChanged", $scope.SelectedRow.entity, $scope.ids, paginationOptions);
        };
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            order: "desc",
            sort: "id",
        };
        $scope.gridOptions = {
            paginationPageSizes: [10, 15, 25, 50, 75],
            paginationPageSize: paginationOptions.pageSize,
            enableRowSelection: true,
            useExternalPagination: true,
            useExternalSorting: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            columnDefs:
                [
                    { field: 'action', displayName: 'action', width: 80, align: 'center' },
                    { field: 'add_by', displayName: 'add_by', width: 80, align: 'center' },
                    { field: 'action_data', displayName: 'action_data', width: "*", align: 'center' },
                    { field: 'add_on', displayName: 'add_on', width: 80, align: 'center' },
                    { field: 'app_code', displayName: 'app_code', width: 80, align: 'center' },
                    { field: 'id', displayName: 'id', width: 80, align: 'center' },
                    { field: 'ip', displayName: 'ip', width: 80, align: 'center' },
                    { field: 'menu_code', displayName: 'menu_code', width: 80, align: 'center' },
                ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = "";
                    } else {
                        paginationOptions.sort = sortColumns[0].sort.direction;
                    }
                    getPage();
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                    getPage();
                });
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    // var msg = 'row selected ' + row.;
                    $scope.SelectedRow = row;
                    $scope.CurrentRow = Object.assign({}, row);
                    $scope.selectedRowIndex = $scope.gridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                    // var msg = 'rows changed ' + rows.length;
                    //  console.log(msg);
                });
            }
        };
        var getPage = function () {
            $http.get(km.model.urls["MyLog_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order + "&add_by=" + 0 + "&_t=" + com.settings.timestamp()).success(function (result) {
                    $scope.gridOptions.totalItems = result.total;
                    $scope.gridOptions.data = result.rows;
                    GetIDS();
                    $scope.gridApi.grid.modifyRows($scope.gridOptions.data);

                    if ($scope.gridOptions.data.length > 0)
                        $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
                });
        }


        GetIDS = function () {
            var names = [];

            $.each($scope.gridOptions.data, function (index, item) {
                names.push(item.id);
            });

            if (names.length == 0)
                $scope.ids = "0"
            else
                $scope.ids = names.join(",");
        }

        getPage();
    }
]);




//app.controller('GridDemoCtrl', ['$scope', '$http', function ($scope, $http) {
//    $scope.gridOptions1 = {
//        paginationPageSizes: [25, 50, 75],
//        paginationPageSize: 25,
//        columnDefs: [
//            { name: 'name' },
//            { name: 'gender' },
//            { name: 'company' }
//        ]
//    };

//    $scope.gridOptions2 = {
//        enablePaginationControls: false,
//        paginationPageSize: 25,
//        columnDefs: [
//            { name: 'name' },
//            { name: 'gender' },
//            { name: 'company' }
//        ]
//    };

//    $scope.gridOptions2.onRegisterApi = function (gridApi) {
//        $scope.gridApi2 = gridApi;
//    }

//    $http.get('/data/100.json')
//        .then(function (response) {
//            $scope.gridOptions1.data = response.data;
//            $scope.gridOptions2.data = response.data;
//        });
//}]);



//app.controller('GridDemoCtrl', function ($scope, $http) {
//    $scope.filterOptions = {
//        filterText: "",
//        useExternalFilter: true
//    };
//    $scope.pagingOptions = {
//        pageSizes: [5, 10, 20],
//        pageSize: 5,
//        totalServerItems: 0,
//        currentPage: 1
//    };
//    $scope.setPagingData = function (data, page, pageSize) {
//        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
//        $scope.myData = pagedData;
//        $scope.pagingOptions.totalServerItems = data.length;
//        if (!$scope.$$phase) {
//            $scope.$apply();
//        }
//    };
//    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
//        setTimeout(function () {
//            var data;
//            if (searchText) {
//                var ft = searchText.toLowerCase();
//                $http.get('largeLoad.json').success(function (largeLoad) {
//                    data = largeLoad.filter(function (item) {
//                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
//                    });
//                    $scope.setPagingData(data, page, pageSize);
//                });
//            } else {
//                $http.get('largeLoad.json').success(function (largeLoad) {
//                    $scope.setPagingData(largeLoad, page, pageSize);
//                });
//            }
//        }, 100);
//    };

//    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

//    $scope.$watch('pagingOptions', function (newVal, oldVal) {
//        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
//            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
//        }
//    }, true);
//    $scope.$watch('filterOptions', function (newVal, oldVal) {
//        if (newVal !== oldVal) {
//            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
//        }
//    }, true);

//    $scope.gridOptions = {
//        data: 'myData',
//        enablePaging: true,
//        showFooter: true,
//        pagingOptions: $scope.pagingOptions,
//        filterOptions: $scope.filterOptions
//    };
//});

//app.controller('GridDemoCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {
//    $scope.setts = [];
//    $scope.columns =
//        [{ field: "id", width: 120, pinned: true, displayName: 'Index' },//, cellTemplate: cellTemplate },
//        { field: "sample_file", width: 120 },
//        { field: "production_types", width: 120 },
//        { field: "add_on", width: 120 }];

//        //[
//        //    { name: '_id', visible: false },
//        //    {
//        //        name: 'data', cellEditableCondition: false,
//        //        displayName: 'Days', headerCellTemplate: $scope.headerToday,
//        //        width: '10%', cellTemplate:
//        //            '<div class="ERdateElemnet" style="text-align:center;" ng-repeat="item in row.entity[col.field]">{{item}}</div>',
//        //        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
//        //            if (grid.getCellValue(row, col)[0] == "Sab" || grid.getCellValue(row, col)[0] == "Dom") {
//        //                return 'blue';
//        //            }
//        //        }
//        //    }


//        //];
        
//    $scope.gridOptions = {
//        paginationPageSizes: [15,25, 50, 75],
//         paginationPageSize: 15,
//        enableRowSelection: true,
//        enableSorting: true,
//        enableColumnMenus: false,
//        showFilters: false,
//        enableHorizontalScrollbar: 0,
//        enableVerticalScrollbar: 0,
//        //enableCellEditOnFocus: true,
//        // showHeader: false,
//        showHeader: true,
//        rowHeight: 40,
//        columnDefs: $scope.columns, 
//        onRegisterApi: function (gridApi) {
//            $scope.gridApi = gridApi;
//            $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
//          //  $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
//        }
//    };

//         $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
//            paginationOptions.pageNumber = newPage;
//            paginationOptions.pageSize = pageSize;
//            getPage();
//        });
//    var data1 = new Date();
//    var date2 = new Date(data1);

//    var days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
//    $scope.setts.push({
//        "_id": 1,
//        "data": [days[date2.getDay()], date2.getDate()],
//        "date": '18-11-2015',

//    });
//    $scope.setts.push({
//        "_id": 2,
//        "data": ['Mart', 19],
//        "date": '19-11-2015',

//    });
//    $scope.setts.push({
//        "_id": 3,
//        "data": ['Merc', 20],
//        "date": '20-11-2015',

//    });
//    $scope.setts.push({
//        "_id": 4,
//        "data": ['Giov', 21],
//        "date": '21-11-2015',

//    });
//    $scope.setts.push({
//        "_id": 5,
//        "data": ['Ven', 22],
//        "date": '22-11-2015',

//    });
//    $scope.setts.push({
//        "_id": 6,
//        "data": ['Sab', 23],
//        "date": '23-11-2015',

//    });
//    $scope.setts.push({
//        "_id": 5,
//        "data": ['Dom', 24],
//        "date": '24-11-2015',

//    });
//    $scope.gridOptions.data = $scope.setts;


//    console.log($scope.gridOptions.data)
//}]);



//  app.controller('GridDemoCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
//    //$scope.filterOptions = {
//    //    filterText: "",
//    //    useExternalFilter: true
//    //}; 
//    //$interval(function () {
//    //    $scope.gridOptions.selectRow(0, true);
//    //    if ($scope.mySelections[0] != undefined)
//    //        console.log($scope.mySelections[0]);
//    //}, 0, 1);

//    $scope.totalServerItems = 0;
//    $scope.pagingOptions = {
//        pageSizes: [10, 15, 20,25,30],
//        pageSize: 10,
//        currentPage: 1
//    };  
//    $scope.setPagingData = function(data, page, pageSize){  
//        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
//        $scope.myData = pagedData; 
//        if (!$scope.$$phase) {
//            $scope.$apply();
//        }
//    };
//    $scope.getPagedDataAsync = function (pageSize, page, sort, directions) {
//        setTimeout(function () {
//            var data; 
//            $http.get(km.model.urls["SampleFile_pager"] + "&page=" + page + "&rows=" + pageSize + "&sort=" + sort + "&order=" + directions+"&client_id=0").success(function (result) {
//                $scope.totalServerItems = result.total;
//                //$scope.gridApi.grid.modifyRows($scope.gridOptions.data);
//                //$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]); 

//               // console.log(result.total);

//              //  $scope.gridOptions.selectRow(0, true); 

//                //setTimeout(function () {
//                //    $scope.gridOptions.selectRow(0, true);
//                //}, 0);
//                //$scope.gridApi.grid.modifyRows($scope.gridOptions.data);
//                //$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);

//               flag = false;
//               $scope.setPagingData(result.rows, 1, pageSize);
//                }); 
//        }, 100);
//    }; 
//    var flag = true;
//     $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,"",""); 
//    $scope.$watch('pagingOptions', function (newVal, oldVal) { 
//        if (flag!=true)
//            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,
//                $scope.sortInfo.fields[0], $scope.sortInfo.directions[0]
//            ); 
//    }, true); 
//    $scope.$watch('sortInfo', function (newVal, oldVal) {
//        if (flag != true)
//        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,
//            newVal.fields[0], newVal.directions[0]); 
//        $scope.sortInfo = newVal;
//    }, true);  
//    $scope.sortInfo = { fields: ['id'], directions: ['asc'] }; 
//    $scope.mySelections = [];
//    $scope.gridApis = {} ;
//    $scope.gridOptions = {
//        enableSorting: true,
//        afterSelectionChange: function (data) {
//            if ($scope.mySelections[0] != undefined)
//             console.log($scope.mySelections[0]);
//        },
//        sortInfo: $scope.sortInfo,
//        useExternalSorting: true, 
//        columnDefs: [{ field: "id", width: 120, pinned: true, displayName: 'Index' },//, cellTemplate: cellTemplate },
//            { field: "sample_file", width: 120 },
//            { field: "production_types", width: 120 },
//            { field: "add_on", width: 120  }],

//        selectedItems: $scope.mySelections,
//        enableRowSelection: true,
//        enableColumnResize: true,
//        multiSelect: false,
//        data: 'myData',
//        maintainColumnRatios: true,
//        primaryKey: 'id',
//        enableCellEdit: true,
//        enablePaging: true,
//        showFooter: true,
//        totalServerItems: 'totalServerItems',
//        pagingOptions: $scope.pagingOptions,
//        onRegisterApi: function (api) {
//           // alert('now it work')
//            $scope.gridApis = api; 
//            //$scope.gridApi.grid.modifyRows($scope.gridOptions.data);
//            //$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);

//        }
//    };
//    //$scope.gridOptions.onRegisterApi  = function (gridApi) {
//    //    console.log("onRegisterApi");
//    //    }


//}]);
    //(function () {
    //    'use strict';

    //    angular.module('app')
    //        .controller('GridController', GridController);

    //    GridController.$inject = [];

    //    function GridController() {
    //        var gridCtrl = this;

    //        gridCtrl.gridOptions = {
    //            data: [
    //                {
    //                    "firstName": "Cox",
    //                    "lastName": "Carney",
    //                    "company": "Enormo",
    //                    "employed": true
    //                },
    //                {
    //                    "firstName": "Lorraine",
    //                    "lastName": "Wise",
    //                    "company": "Comveyer",
    //                    "employed": false
    //                },
    //                {
    //                    "firstName": "Nancy",
    //                    "lastName": "Waters",
    //                    "company": "Fuelton",
    //                    "employed": false
    //                }
    //            ]
    //        }
    //    }
    //})();

////var cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" ng-click="selectItem(row.id)">clickme</div>';
//app.controller('GridDemoCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
//    //$scope.filterOptions = {
//    //    filterText: "",
//    //    useExternalFilter: true
//    //}; 
//    //$interval(function () {
//    //    $scope.gridOptions.selectRow(0, true);
//    //    if ($scope.mySelections[0] != undefined)
//    //        console.log($scope.mySelections[0]);
//    //}, 0, 1);

//    $scope.totalServerItems = 0;
//    $scope.pagingOptions = {
//        pageSizes: [10, 15, 20,25,30],
//        pageSize: 10,
//        currentPage: 1
//    };  
//    $scope.setPagingData = function(data, page, pageSize){  
//        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
//        $scope.myData = pagedData; 
//        if (!$scope.$$phase) {
//            $scope.$apply();
//        }
//    };
//    $scope.getPagedDataAsync = function (pageSize, page, sort, directions) {
//        setTimeout(function () {
//            var data; 
//            $http.get(km.model.urls["SampleFile_pager"] + "&page=" + page + "&rows=" + pageSize + "&sort=" + sort + "&order=" + directions+"&client_id=0").success(function (result) {
//                $scope.totalServerItems = result.total;
//                //$scope.gridApi.grid.modifyRows($scope.gridOptions.data);
//                //$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]); 

//               // console.log(result.total);

//              //  $scope.gridOptions.selectRow(0, true); 

//                //setTimeout(function () {
//                //    $scope.gridOptions.selectRow(0, true);
//                //}, 0);
                 
//               flag = false;
//               $scope.setPagingData(result.rows, 1, pageSize);
//                }); 
//        }, 100);
//    }; 
//    var flag = true;
//     $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,"",""); 
//    $scope.$watch('pagingOptions', function (newVal, oldVal) { 
//        if (flag!=true)
//            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,
//                $scope.sortInfo.fields[0], $scope.sortInfo.directions[0]
//            ); 
//    }, true); 
//    $scope.$watch('sortInfo', function (newVal, oldVal) {
//        if (flag != true)
//        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,
//            newVal.fields[0], newVal.directions[0]); 
//        $scope.sortInfo = newVal;
//    }, true);  
//    $scope.sortInfo = { fields: ['id'], directions: ['asc'] }; 
//    $scope.mySelections = [];
//    $scope.gridOptions = {
//        enableSorting: true,
//        afterSelectionChange: function (data) {
//            if ($scope.mySelections[0] != undefined)
//             console.log($scope.mySelections[0]);
//        },
//        sortInfo: $scope.sortInfo,
//        useExternalSorting: true, 
//        columnDefs: [{ field: "id", width: 120, pinned: true, displayName: 'Index' },//, cellTemplate: cellTemplate },
//            { field: "sample_file", width: 120 },
//            { field: "production_types", width: 120 },
//            { field: "add_on", width: 120  }],

//        selectedItems: $scope.mySelections,
//        enableRowSelection: true,
//        enableColumnResize: true,
//        multiSelect: false,
//        data: 'myData',
//        maintainColumnRatios: true,
//        primaryKey: 'id',
//        enableCellEdit: true,
//        enablePaging: true,
//        showFooter: true,
//        totalServerItems: 'totalServerItems',
//        pagingOptions: $scope.pagingOptions,
//        onRegisterApi: function (api) {
//            alert('now it work')
//            $scope.gridApis.push(api);
//        }
//    };
//    //$scope.gridOptions.onRegisterApi  = function (gridApi) {
//    //    console.log("onRegisterApi");
//    //    }


//}]);



//$scope.gridOptions = {
//    enableSorting: true,
//    columnDefs: heading,
//    data: list,
//    minRowsToShow: 12,
//    excessRows: 20,
//    multiSelect: false,
//    displaySelectionCheckbox: false,//;$scope.datagrid.select,
//    showGridFooter: true,
//    enableHorizontalScrollbar: 2,
//    enableVerticalScrollbar: 2,
//    onRegisterApi: function (gridApi) {
//        alert('x');
//        $scope.gridApi = gridApi;
//    },
//    appScopeProvider: $scope.myAppScopeProvider,
//    rowTemplate: "<div ng-click="grid.appScope.iconClicked()" ng-dblclick="grid.appScope.showInfo(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui - grid - cell" ng-class="{ 'ui-grid-row-header-cell': col.isRowHeader }" ui-grid-cell>"
//};

