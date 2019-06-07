
/*
//------------------------------------------------------------------------------ 
//        Date  2019-05-21
//        Author  蔡捷   
//			 				User Admin 
//        File  sm_user.cshtml  Page file  
//        File  sm_user.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/sm_user.js
 Description User Admin(sm_user)  js File 
*/
// Current page object 
var km = {};
km.init = function () {
}




//------------------------------------------------------------------------------ 
//        Date  2019-05-21
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  






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
    $rootScope.$on("UserInfoSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row ); 
        $(".tmpHide").removeClass("tmpHide");
    });
    $scope.insert = function () {  
        $rootScope.$broadcast("UserInfoInsert", $scope.row);
    };
    $scope.delete = function (id) {
        $rootScope.$broadcast("UserInfoDelete", $scope.row.id, $scope.row.id);
    };
    $scope.update = function () {
        $rootScope.$broadcast("UserInfoUpdate", $scope.row);
    }; 
    //$scope.$watch("row.ip", function (newValue, oldValue) {
    //    console.log("$watch:"+newValue); 
    //});

    $scope.ipchanged = function () {
        console.log("ipchanged:"+$scope.row.ip);
    }

});
*/




app.controller('UserInfoModalInstanceControl', ['$scope', '$modalInstance', '$http', 'row', function ($scope, $modalInstance, $http, row) {

    $scope.DDLData = row.ddldata;
    $scope.loader = function (param) {
        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader + "&value=" + param.keyword);
    };
    $scope.row = row;
    $scope.ok = function () {
        $modalInstance.close($scope.row);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])




app.controller('UserInfoCtrl', [
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





        $scope.open = function (size, EditType) {
            var modalInstance = $modal.open({
                templateUrl: 'UserInfoDetail',
                controller: 'UserInfoModalInstanceControl',
                size: size,
                resolve: {
                    row: function () {
                        $scope.row.EditType = EditType;
                        $scope.row.ddldata = $scope.DDLData
                        return $scope.row;
                    }
                }
            });

            modalInstance.result.then(function (row) {
                if (row.EditType == "Edit") {
                    $scope.updateData(row)
                }
                if (row.EditType == "Insert") {
                    $scope.insertData(row)
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        $scope.InsertPopup = function () {

            var row = $scope.copyEmptyObject($scope.row);
            $scope.row = row;

            $scope.row.editrow = true;
            $scope.open('lg', 'Insert');
        }
        $scope.EditPopup = function (row) {

            $scope.row = Object.assign({}, row);

            $scope.row.editrow = true;
            $scope.open('lg', 'Edit');
        }


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
            $scope.UserInfogridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.UserInfogridOptions.data);
            $scope.gridApi.selection.selectRow($scope.UserInfogridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.InsertRowInline = function () {
            $scope.editType = "i";
            var row = $scope.copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.MyLoggridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.MyLoggridOptions.data);
            $scope.gridApi.selection.selectRow($scope.MyLoggridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.gridApi.grid.rows[0].inlineEdit.enterEditMode();
        }

        $scope.editRow = function (row) {
            $scope.editType = "u";
            var index = $scope.UserInfogridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.UserInfogridOptions.data[index].editrow = !$scope.UserInfogridOptions.data[index].editrow;
        };
        $scope.saveRow = function (row) {
            var index = $scope.UserInfogridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.UserInfogridOptions.data[index].editrow = !$scope.UserInfogridOptions.data[index].editrow;

            if ($scope.editType == "i") {
                $scope.insertData(row);
            } else
                $scope.updateData(row);
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            var index = $scope.MyLoggridOptions.data.indexOf(row);

            if ($scope.editType == "i") {
                $scope.MyLoggridOptions.data.splice(0, 1);
            } else {

                if (index > 0) {
                    if (row != null) {
                        //  $scope.MyLoggridOptions.data.splice(0, 1);
                        var keys = Object.keys($scope.row);
                        keys.forEach(function (k) {
                            $scope.MyLoggridOptions.data[index][k] = $scope.row[k];
                        });
                        //Use that to set the editrow attrbute value to false
                        $scope.MyLoggridOptions.data[index].editrow = false;
                    }
                }
            }
            $scope.editType = "";
            $scope.SelectedRow.entity.editrow = false;
            $rootScope.$broadcast("SysToaster", 'info', "", "Row editing cancelled");
        };

        $scope.$on("UserInfoUpdate", function (event, row) {
            $scope.updateData(row)
        });
        $scope.$on("UserInfoInsert", function (event, row) {
            $scope.insertData(row);
        });
        $scope.$on("UserInfoDelete", function (event, id, text) {
            $scope.deleteIt(id, text)
        });

        $scope.$on("UserInfoCancel", function (event, row) {
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
                type: 'POST', url: km.model.urls["UserInfo_insert"], data: row, success: function (result) {
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
                $scope.UserInfogridOptions.data.splice(0, 1);
            }
            if ($scope.UserInfogridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.UserInfogridOptions.data.splice($scope.UserInfogridOptions.data.length - 1, 1);
            }
            $scope.editType = "";
            $scope.UserInfogridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.UserInfogridOptions.data);
            $scope.gridApi.selection.selectRow($scope.UserInfogridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
            $scope.UserInfogridOptions.totalItems = $scope.UserInfogridOptions.totalItems + 1;
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
                type: 'POST', url: km.model.urls["UserInfo_delete"], data: parms, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        $scope.afterDelete(r);
                    }
                    $scope.showResult(result, "Delete");
                }
            });
        }
        $scope.staff = function (id) {
            var parms = { puser_id: id }
            com.ajax({
                type: 'POST', url: km.model.urls["update_to_staff"], data: parms, success: function (result) {

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
                    $scope.showResult(result, "Staff");
                }
            });
        }
        $scope.afterDelete = function (row) {
            if ($scope.UserInfogridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.UserInfogridOptions.data.push(row);
            }
            $scope.UserInfogridOptions.totalItems = $scope.UserInfogridOptions.totalItems - 1;
            $scope.UserInfogridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.UserInfogridOptions.data);
            $scope.gridApi.selection.selectRow($scope.UserInfogridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.updateData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["UserInfo_update"], data: row, success: function (result) {
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
            $rootScope.$broadcast("UserInfoSelectedRowChanged", $scope.row);
        };
        $scope.EditSide = function (row) {
            row.EditType = "Update";

            $scope.SelectedRow = row;
            row.editrow = true;
            $rootScope.$broadcast("UserInfoEditSide", row);
        };
        $scope.InsertSide = function () {

            var row = $scope.copyEmptyObject($scope.row);
            row.EditType = "Insert";
            $rootScope.$broadcast("UserInfoEditSide", row);
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


        $scope.UserInfogridOptions = {
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
                        field: 'user_code', displayName: 'User Code', width: 80, align: 'center',
                    },
                    {
                        field: 'real_name', displayName: 'Name', width: 80, align: 'center',
                    },
                    {
                        field: 'active', displayName: 'Active', width: 80, align: 'center',
                        cellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.TranslateToText('0=inactive 1=active',row.entity.active)}}</div>"
                    },
                    //{ field: 'add_by', displayName: '创建人', width: 80, align: 'center',
                    //  },
                    {
                        field: 'add_on', displayName: 'Add On', width: 120, align: 'center',
                    },
                    //{ field: 'department_id', displayName: '部门编号', width: 80, align: 'center',
                    //  },
                    {
                        field: 'email', displayName: 'Email', width: "*", align: 'center',
                    },
                    {
                        field: 'id', displayName: 'User ID', width: 80, align: 'center',
                    },
                    //{ field: 'language', displayName: 'Language', width: 80, align: 'center',
                    //  },
                    //{ field: 'password', displayName: '口令', width: 80, align: 'center',
                    //  },
                    {
                        field: 'phone', displayName: 'Phone', width: 80, align: 'center',
                    },
                    //{ field: 'secretkey', displayName: 'Secretkey', width: 80, align: 'center',
                    //  },
                    {
                        field: 'sex', displayName: 'Gender', width: 80, align: 'center',
                        cellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.TranslateToText('m=Male f=Famle',row.entity.sex)}}</div>"
                    },
                    //{ field: 'spell', displayName: '拼写', width: 80, align: 'center',
                    //  },



                    //{ field: 'user_type', displayName: '用户类型', width: 80, align: 'center',
                    //  },
                    {
                        name: '1Actions ', field: 'edit', enableFiltering: false, enableSorting: false, enableColumnMenu: false,
                        cellTemplate: '<div><button  class="btn primary" ng-click="grid.appScope.EditPopup(row.entity)"><ifa-edit"><i class="fa fa-edit"></i></button>' +  //Edit Button
                            '<button  class="btn primary" ng-hide="!row.entity.flag_update_to_staff" ng-click="grid.appScope.staff(row.entity.id)"><i class="fa  fa-cogs"></i></button>' +//Save Button
                            '<button  class="btn primary"  ng-click="grid.appScope.delete(row.entity.id)"><i class="fa fa-trash"></i></button>' +//Save Button
                            '</div>', width: 120
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
                    $scope.selectedRowIndex = $scope.UserInfogridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
            }
        };

        $scope.getPage = function () {
            $http.get(km.model.urls["UserInfo_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order + "&_t=" + com.settings.timestamp()).success(function (result) {
                    result.rows.forEach(function (d) {
                        d.editrow = false;
                        d.context = d.context.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
                    });
                    $scope.UserInfogridOptions.totalItems = result.total;
                    $scope.UserInfogridOptions.data = result.rows;
                    $scope.GetIDS();
                    $scope.gridApi.grid.modifyRows($scope.UserInfogridOptions.data);

                    if ($scope.UserInfogridOptions.data.length > 0)
                        $scope.gridApi.selection.selectRow($scope.UserInfogridOptions.data[0]);
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

            $.each($scope.UserInfogridOptions.data, function (index, item) {
                names.push(item.id);
            });

            if (names.length == 0)
                $scope.ids = "0"
            else
                $scope.ids = names.join(",");
        }
        $scope.getPage();
    }
]);



