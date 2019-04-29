var km = {};
km.model = null; 
km.init = function () { 
}

var counter = 0;
app.controller('MainCtrl2', [
    '$scope', '$rootScope', '$http', '$modal', function ($scope, $rootScope, $http, $modal) { 
$rootScope.$broadcast("destory"); 
        $scope.test = function () {
            console.log(angular.isDefined('MyLogCtrl243214'));
        $rootScope.$broadcast("test"); 

    }; 

    }]);


app.controller('MyLogCtrl', [
    '$scope', '$rootScope', '$http', '$modal', function ($scope, $rootScope, $http, $modal) {
        $scope.SelectedRow = {};//for getting row detail
        $scope.row = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;


        var destory = false;
        $rootScope.$on("MyLogCtrlDestory", function (event, row) {
            destory = true;
        });
        $rootScope.$on("MyLogUpdate", function (event, row) {
            if (!destory)
                updateData(row)
        });
        $rootScope.$on("MyLogInsert", function (event, row) {
            if (!destory)
                insertData(row);
        });
        $rootScope.$on("MyLogDelete", function (event, id, text) {
            if (!destory)
                deleteIt(id, text)
        });

        $scope.insert = function () {
            insertData($scope.row);
        };
        $scope.delete = function () {
            deleteIt($scope.row.id, $scope.row.id);
        };
        $scope.update = function () {
            updateData($scope.row);
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

            console.log($scope.gridOptions.totalItems);
                console.log((paginationOptions.pageNumber ) * paginationOptions.pageSize)
            if ($scope.gridOptions.totalItems >= (paginationOptions.pageNumber ) * paginationOptions.pageSize ) {
            $scope.gridOptions.data.splice($scope.gridOptions.data.length - 1, 1);
               
            }

         $scope.gridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
            $scope.gridApi.core.refresh();
            GetIDS();
            $scope.gridOptions.totalItems = $scope.gridOptions.totalItems + 1;
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
            if ($scope.gridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.gridOptions.data.push(row);
            }

            $scope.gridOptions.totalItems = $scope.gridOptions.totalItems - 1;
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
            $rootScope.$broadcast("MyLogSelectedRowChanged");
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
                    { field: 'id', displayName: 'id', width: 80, align: 'center' },
                    { field: 'action', displayName: 'action', width: 80, align: 'center' },
                    { field: 'action_data', displayName: 'action_data', width: "*", align: 'center' },
                    { field: 'add_by', displayName: 'add_by', width: 80, align: 'center' },
                    { field: 'add_on', displayName: 'add_on', width: 80, align: 'center' },
                    { field: 'app_code', displayName: 'app_code', width: 80, align: 'center' },
                    { field: 'ip', displayName: 'ip', width: 80, align: 'center' },
                    { field: 'menu_code', displayName: 'menu_code', width: 80, align: 'center' },
                ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = "";
                    } else {
                        paginationOptions.order = sortColumns[0].sort.direction;
                        paginationOptions.sort = sortColumns[0].field;
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
                    $scope.row = Object.assign({}, row.entity);
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
