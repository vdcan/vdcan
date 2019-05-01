var km = {};
km.model = null;
km.init = function () {
}

////var counter = 0;
////app.controller('MainCtrl2', [
////    '$scope', '$rootScope', '$http', '$modal', function ($scope, $rootScope, $http, $modal) {
////        //$rootScope.$broadcast("destory"); 
////        $scope.test = function () {
////            //    console.log(angular.isDefined('MyLogCtrl243214'));
////            $rootScope.$broadcast("test");

////        };

////    }]);


app.controller('MainCtrl2', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.row = $scope.$parent.row;
    $scope.test = "fdsaf";
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl', 
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}])
    ; 

//------------------------------------------------------------------------------ 
//        Date  2019-04-30
//        Author  �̽�   
//			   
//------------------------------------------------------------------------------  
app.controller('MyLog2Ctrl', [
    '$scope', '$rootScope', '$http', '$modal', function ($scope, $rootScope, $http, $modal) {
        $scope.SelectedRow = {};//for getting row detail
        $scope.row = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;
        var editType = "";
        var vm = this;
        vm.test = "parent";
        vm.myrow = {}; 
        /*$scope.$on('$destroy', function () {
            console.log('Child1 is no longer necessary');
        })

        $scope.$on('test', function () {

            console.log('test' + counter); counter++;
        })*/
        $scope.InsertRow = function () {

            editType = "i";
            var row = copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.MyLog2gridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.MyLog2gridOptions.data);
            $scope.gridApi.selection.selectRow($scope.MyLog2gridOptions.data[0]);
            $scope.gridApi.core.refresh();
            GetIDS();
        }
        $scope.editRow = function (row) {
            editType = "u";
            var index = $scope.MyLog2gridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.MyLog2gridOptions.data[index].editrow = !$scope.MyLog2gridOptions.data[index].editrow;
        };
        $scope.saveRow = function (row) {
            var index = $scope.MyLog2gridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.MyLog2gridOptions.data[index].editrow = !$scope.MyLog2gridOptions.data[index].editrow;
            if (editType == "u")
                updateData(row);
            if (editType == "i") {
                insertData(row);
            }
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            var index = $scope.MyLog2gridOptions.data.indexOf(row);
            if (editType == "i") {
                $scope.MyLog2gridOptions.data.splice(0, 1);
            }
            if (editType == "u") {
                //  $scope.MyLog2gridOptions.data.splice(0, 1);
                var keys = Object.keys($scope.row);
                keys.forEach(function (k) {
                    $scope.MyLog2gridOptions.data[index][k] = $scope.row[k];
                });
                //Use that to set the editrow attrbute value to false
                $scope.MyLog2gridOptions.data[index].editrow = false;
            }

            $rootScope.$broadcast("SysToaster", 'info', "", "Row editing cancelled");
        };

        $scope.$on("MyLog2Update", function (event, row) {
            updateData(row)
        });
        $scope.$on("MyLog2Insert", function (event, row) {
            insertData(row);
        });
        $scope.$on("MyLog2Delete", function (event, id, text) {
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
            if (editType == "i") {
                $scope.MyLog2gridOptions.data.splice(0, 1);
            }
            if ($scope.MyLog2gridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.MyLog2gridOptions.data.splice($scope.MyLog2gridOptions.data.length - 1, 1);
            }
            editType = "";
            $scope.MyLog2gridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.MyLog2gridOptions.data);
            $scope.gridApi.selection.selectRow($scope.MyLog2gridOptions.data[0]);
            $scope.gridApi.core.refresh();
            GetIDS();
            $scope.MyLog2gridOptions.totalItems = $scope.MyLog2gridOptions.totalItems + 1;
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
            if ($scope.MyLog2gridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.MyLog2gridOptions.data.push(row);
            }
            $scope.MyLog2gridOptions.totalItems = $scope.MyLog2gridOptions.totalItems - 1;
            $scope.MyLog2gridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.MyLog2gridOptions.data);
            $scope.gridApi.selection.selectRow($scope.MyLog2gridOptions.data[0]);
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
            editType = "";
            $scope.gridApi.core.refresh();
        }
        $scope.sync = function () {
            $rootScope.$broadcast("MyLog2SelectedRowChanged");
        };
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            order: "desc",
            sort: "id",
        };
        $scope.MyLog2gridOptions = {
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
                    field: 'action', displayName: 'action', width: 80, align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
                {
                    field: 'action_data', displayName: 'action_data', width: "*", align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
                {
                    field: 'add_by', displayName: 'add_by', width: 80, align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
                {
                    field: 'add_on', displayName: 'add_on', width: 80, align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
                {
                    field: 'app_code', displayName: 'app_code', width: 80, align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
                {
                    field: 'id', displayName: 'id', width: 80, align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
                {
                    field: 'ip', displayName: 'ip', width: 80, align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
                {
                    field: 'menu_code', displayName: 'menu_code', width: 80, align: 'center',
                    cellTemplate: '<div class="ui-grid-cell-contents"  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/></div>'
                },
 {
                    name: 'Actions ', field: 'edit', enableFiltering: false, enableSorting: false, enableColumnMenu: false,
                    cellTemplate: '<div><button ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.editRow(row.entity)"><ifa-edit"><i class="fa fa-edit"></i></button>' +  //Edit Button
                        '<button ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.delete(row.entity.id)"><i class="fa fa-trash"></i></button>' +//Save Button
                        '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.saveRow(row.entity)"><i class="fa fa-floppy-o"></i></button>' +//Save Button
                        '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.cancelEdit(row.entity)"><i class="fa fa-times"></i></button>' + //Cancel Button
                        '</div>', width: 80
                }

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
                    vm.myrow = $scope.row;
                    $scope.selectedRowIndex = $scope.MyLog2gridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
            }
        };

        var getPage = function () {
            $http.get(km.model.urls["MyLog_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order + "&_t=" + com.settings.timestamp()).success(function (result) {
                    result.rows.forEach(function (d) {
                        d.editrow = false;
                    });
                    $scope.MyLog2gridOptions.totalItems = result.total;
                    $scope.MyLog2gridOptions.data = result.rows;
                    GetIDS();
                    $scope.gridApi.grid.modifyRows($scope.MyLog2gridOptions.data);

                    if ($scope.MyLog2gridOptions.data.length > 0)
                        $scope.gridApi.selection.selectRow($scope.MyLog2gridOptions.data[0]);
                });
        }
        copyEmptyObject = function (source, isArray) {
            var o = Array.isArray(source) ? [] : {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    var t = typeof source[key];
                    o[key] = t == 'object' ? skeleton(source[key]) : { string: '', number: 0, boolean: false }[t];
                }
            }
            return o;
        }
        GetIDS = function () {
            var names = [];

            $.each($scope.MyLog2gridOptions.data, function (index, item) {
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
