var km = {};
km.model = null;
km.init = function () {
}

var counter = 0;
app.controller('MainCtrl2', [
    '$scope', '$rootScope', '$http', '$modal', function ($scope, $rootScope, $http, $modal) {
        //$rootScope.$broadcast("destory"); 
        $scope.test = function () {
            //    console.log(angular.isDefined('MyLogCtrl243214'));
            $rootScope.$broadcast("test");

        };

    }]);



app.controller('MyLogCtrl', [
    '$scope', '$rootScope', '$http', '$modal', function ($scope, $rootScope, $http, $modal) {
        $scope.SelectedRow = {};//for getting row detail
        $scope.row = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;
        var editType = "";

        $scope.$on('$destroy', function () {
            console.log('Child1 is no longer necessary');
        })

        $scope.$on('test', function () {

            console.log('test' + counter); counter++;
        })


        $scope.InsertRow = function () {

            editType = "i";
            var row = copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.gridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
             $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
            $scope.gridApi.core.refresh();
            GetIDS();
            console.log("InsertRow");
        }
        $scope.editRow = function (row) {
            editType = "u";
            var index = $scope.gridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row); 
            //Use that to set the editrow attrbute value for seleted rows
            $scope.gridOptions.data[index].editrow = !$scope.gridOptions.data[index].editrow; 
        };

        $scope.saveRow = function (row) { 
            var index = $scope.gridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.gridOptions.data[index].editrow = !$scope.gridOptions.data[index].editrow; 
            if (editType == "u")
                updateData(row);
            if (editType == "i"){
                insertData(row);
            }
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            var index = $scope.gridOptions.data.indexOf(row);  
            if (editType == "i") {
                $scope.gridOptions.data.splice(0, 1);
            }
            if (editType == "u") {
              //  $scope.gridOptions.data.splice(0, 1);
                var keys = Object.keys($scope.row);
                keys.forEach(function (k) {
                    $scope.gridOptions.data[index][k] =   $scope.row[k];
                }); 
            //Use that to set the editrow attrbute value to false
                $scope.gridOptions.data[index].editrow = false; 
            } 

            $rootScope.$broadcast("SysToaster", 'info', "", "Row editing cancelled");
        };

        $scope.$on("MyLogDestory", function (event) {
            destory = true;
        });
        $scope.$on("MyLogUpdate", function (event, row) {
            updateData(row)
        });
        $scope.$on("MyLogInsert", function (event, row) {
            insertData(row);
        });
        $scope.$on("MyLogDelete", function (event, id, text) {
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
                $scope.gridOptions.data.splice(0, 1);
            }

            if ($scope.gridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.length - 1, 1);

            }
            editType = "";
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
            editType = "";
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
                    {
                        name: 'action',   field: 'action', displayName: 'action', width: 80, align: 'center',
                        cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}1</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/>2</div>'
                    },
                    {
                        name: 'action_data', field: 'action_data', displayName: 'action_data', width: "*", align: 'center',
                        cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/>2</div>'
                    },
                    {
                        name: 'add_by',   field: 'add_by', displayName: 'add_by', width: 80, align: 'center',
                        cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/>2</div>'
                    },
                    {
                        name: 'add_on', field: 'add_on', displayName: 'add_on', width: 80, align: 'center',
                        cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/>2</div>'
                    },
                    {
                        name: 'app_code', field: 'app_code', displayName: 'app_code', width: 80, align: 'center',
                        cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/>2</div>'
                    },
                    { field: 'id', displayName: 'id', width: 80, align: 'center' },
                    {
                        name: 'ip', field: 'ip', displayName: 'ip', width: 80, align: 'center',
                        cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/>2</div>'
                    },
                    {
                        name: 'menu_code', field: 'menu_code', displayName: 'menu_code', width: 80, align: 'center',
                        cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"/>2</div>'
                    },
                    ,
                    {
                        groupHeaderTemplate: '<button class="myButton" ng-click="grid.appScope.InsertRow()">click me</button>',   name: 'Actions ', field: 'edit', enableFiltering: false, enableSorting: false,
                        cellTemplate: '<div><button ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.editRow(row.entity)"><ifa-edit"><i class="fa fa-edit"></i></button>' +  //Edit Button
                            '<button ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.delete(row.entity.id)"><i class="fa fa-trash"></i></button>' +//Save Button
                            '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.saveRow(row.entity)"><i class="fa fa-floppy-o"></i></button>' +//Save Button
                            '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.cancelEdit(row.entity)"><i class="fa fa-times"></i></button>' + //Cancel Button
                            '</div>', width: 100
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
                   // console.log($scope.row);
                    //$scope.row.entity.forEach(function (d) {
                    //    d.editrow = false;
                    //});
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
                    result.rows.forEach(function (d) {
                        d.editrow = false;
                    });

                    $scope.gridOptions.data = result.rows;
                    //console.log($scope.gridOptions.data );
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

function copyEmptyObject(source, isArray) {
    var o = Array.isArray(source) ? [] : {};
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var t = typeof source[key];
            o[key] = t == 'object' ? skeleton(source[key]) : { string: '', number: 0, boolean: false }[t];
        }
    }
    return o;
}
/*
//var app = angular.module('app', ['ui.grid', 'ui.bootstrap']);

//Controller function to load the data
app.controller('MainCtrl', function ($scope, $http, CustomerService) {

    //function to be called on row edit button click
    //Passing the selected row object as parameter, we use this row object to identify  the edited row
    $scope.edit = function (row) {
        //Get the index of selected row from row object
        var index = $scope.gridOptions.data.indexOf(row);
        //Use that to set the editrow attrbute value for seleted rows
        $scope.gridOptions.data[index].editrow = !$scope.gridOptions.data[index].editrow;
    };

    //Method to cancel the edit mode in UIGrid
    $scope.cancelEdit = function (row) {
        //Get the index of selected row from row object
        var index = $scope.gridOptions.data.indexOf(row);
        //Use that to set the editrow attrbute value to false
        $scope.gridOptions.data[index].editrow = false;
        //Display Successfull message after save
        $scope.alerts.push({
            msg: 'Row editing cancelled',
            type: 'info'
        });
    };

    $scope.alerts = [];

    //Class to hold the customer data
    $scope.Customer = {
        customerID: '',
        companyName: '',
        contactName: '',
        contactTitle: ''
    };

    //Function to save the data
    //Here we pass the row object as parmater, we use this row object to identify  the edited row
    $scope.saveRow = function (row) {
        //get the index of selected row 
        var index = $scope.gridOptions.data.indexOf(row);
        //Remove the edit mode when user click on Save button
        $scope.gridOptions.data[index].editrow = false;

        //Assign the updated value to Customer object
        $scope.Customer.customerID = row.CustomerID;
        $scope.Customer.companyName = row.CompanyName;
        $scope.Customer.contactName = row.ContactName;
        $scope.Customer.contactTitle = row.ContactTitle;

        //Call the function to save the data to database
        CustomerService.SaveCustomer($scope).then(function (d) {
            //Display Successfull message after save
            $scope.alerts.push({
                msg: 'Data saved successfully',
                type: 'success'
            });
        }, function (d) {
            //Display Error message if any error occurs
            $scope.alerts.push({
                msg: d.data,
                type: 'danger'
            });
        });
    };
    //Get function to populate the UI-Grid
    $scope.GetCustomer = function () {
        $scope.gridOptions = {
            //Declaring column and its related properties
            columnDefs: [
                {
                    name: "CustomerID", displayName: "Customer ID", field: "CustomerID",
                    cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>', width: 80
                },
                {
                    name: "CompanyName", displayName: "Company Name", field: "CompanyName",
                    cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>', width: 200
                },
                {
                    name: "ContactName", displayName: "Contact Name", field: "ContactName",
                    cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>', width: 140
                },
                {
                    name: "ContactTitle", displayName: "Contact Title", field: "ContactTitle",
                    cellTemplate: '<div  ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div>', width: 140
                },
                {
                    name: 'Actions', field: 'edit', enableFiltering: false, enableSorting: false,
                    cellTemplate: '<div><button ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-edit"></i></button>' +  //Edit Button
                        '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.saveRow(row.entity)"><i class="fa fa-floppy-o"></i></button>' +//Save Button
                        '<button ng-show="row.entity.editrow" class="btn primary" ng-click="grid.appScope.cancelEdit(row.entity)"><i class="fa fa-times"></i></button>' + //Cancel Button
                        '</div>', width: 100
                }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        //Function load the data from database
        CustomerService.GetCustomer().then(function (d) {
            $scope.gridOptions.data = d.data;
        }, function (d) {
            alert(d.data);
        });
    };
    //Call  function to load the data
    $scope.GetCustomer();
});

//Factory
app.factory('CustomerService', function ($http) {
    var res = {};
    res.GetCustomer = function () {
        return $http({
            method: 'GET',
            dataType: 'jsonp',
            url: 'api/Customer/GetCustomer'
        });
    }

    res.SaveCustomer = function ($scope) {
        return $http({
            method: 'POST',
            data: $scope.Customer,
            url: 'api/Customer/UpdateCustomer'
        });
    }
    return res;
});*/