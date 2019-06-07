
/*
//------------------------------------------------------------------------------ 
//        Date  2019-05-21
//        Author  蔡捷   
//			 				Profile 
//        File  my_profile.cshtml  Page file  
//        File  my_profile.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/my_profile.js
 Description Profile(my_profile)  js File 
*/
// Current page object 
var km = {};
km.init = function () {
}



app.controller('editorCtrl', ['$scope', 'textAngularManager', '$timeout', '$http', function ($scope, textAngularManager, $timeout, $http) {
    $scope.color = "";
    $scope.timesSubmitted = 0;
    $scope.canEdit = false;
    $scope.testFrm = {};
    $scope.formatDoc = function (command) {
        console.log(command);
        console.log($scope.color);
        //var editor = textAngularManager.retrieveEditor('item_bodyHTML').scope;
        //editor.displayElements.text.trigger('focus');
        //      editor.wrapSelection('forecolor', $scope.color, true);
    };
    $scope.test = function () {
        $scope.timesSubmitted++;
    };
    $scope.uploadFile = function (files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);
        //"/anjs/home/uploadImage"
        $http.post("/anjs/home/uploadimage", fd, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function (r) {
            console.log(r);
            var img = r.replaceAll(";", "").replaceAll(",", "")
            $scope.insertToHtml("<img src='/upload/" + img + "'/>");
        }
        );

    }; 
    $scope.insertToHtml = function (newText) {
        var editor = textAngularManager.retrieveEditor('item_bodyHTML').scope;


        $timeout(function () {
            editor.displayElements.text.trigger('focus');
            editor.wrapSelection('insertHTML', newText, true);
        });


    } 
    $scope.accessFormFromScope = function () {
        alert("Form Invalid: " + $scope.testFrm.$invalid);
    }

}]); 

//------------------------------------------------------------------------------ 
//        Date  2019-05-21
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  

app.controller('ProfileDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', function ($scope, $rootScope, $stateParams, $modal, $http) {
    /*  var id = $stateParams.id;
      var number = $stateParams.number;
      console.log(id);
      console.log(number);
      */

    $scope.loader = function (param) {
        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader + "&value=" + param.keyword);
    };
    $scope.DDLData = {};
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
    $scope.uploadFile = function (files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);
        //"/anjs/home/uploadImage"
        $http.post(km.model.urls["save_photo"], fd, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function (r) {
               console.log($scope.row);
              $scope.row.photo = r.dt[0].photo;
            //  $scope.row.photo = r.replaceAll(";", "");
            console.log($scope.row);


            $rootScope.$broadcast("ProfilePhoto", $scope.row.photo );
            $scope.row_old.photo = r.dt[0].photo;
           $rootScope.$broadcast("ProfileUploaded", r.dt[0]);
            // $rootScope.$broadcast("SysToaster", 'info', "upload success!");
        }
        );

    };

    $scope.row = {};// = {id:43124};
    $scope.row_old = {};// = {id:43124};
    //$scope.row_original = {};// = {id:43124};
    $rootScope.$on("ProfileSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row);
        $scope.row_old = row;
        $(".tmpHide").removeClass("tmpHide");
    });
    $rootScope.$on("ProfileEditSide", function (event, row) {
        $scope.row = Object.assign({}, row);
        $(".ProfileDetailButtons").show();
        $(".ProfileEdit").hide();
    });
    $scope.save = function () {
        $rootScope.$broadcast("Profile" + $scope.row.EditType, $scope.row);
        $(".ProfileDetailButtons").hide();
        $(".ProfileEdit").show();

        $scope.row.editrow = false;
    }
    $scope.cancel = function () {

        $rootScope.$broadcast("ProfileCancel", $scope.row);
        $(".ProfileDetailButtons").hide();
        $(".ProfileEdit").show();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }

}]);


//------------------------------------------------------------------------------ 
//        Date  2019-05-21
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  


function Profile_8_Init() {

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
    $rootScope.$on("ProfileSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row ); 
        $(".tmpHide").removeClass("tmpHide");
    });
    $scope.insert = function () {  
        $rootScope.$broadcast("ProfileInsert", $scope.row);
    };
    $scope.delete = function (id) {
        $rootScope.$broadcast("ProfileDelete", $scope.row.id, $scope.row.id);
    };
    $scope.update = function () {
        $rootScope.$broadcast("ProfileUpdate", $scope.row);
    }; 
    //$scope.$watch("row.ip", function (newValue, oldValue) {
    //    console.log("$watch:"+newValue); 
    //});

    $scope.ipchanged = function () {
        console.log("ipchanged:"+$scope.row.ip);
    }

});
*/



app.controller('ProfileCtrl', [
    '$scope', '$rootScope', '$http', '$modal', '$q', function ($scope, $rootScope, $http, $modal, $q) {
        $scope.SelectedRow = {};//for getting row detail
        $scope.row = {};// for updating inserting
        $scope.ids = "";//for deleting
        $scope.selectedRowIndex = 0;
        $scope.showInsert = false;
        $scope.loader = function (param) {
            return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader + "&value=" + param.keyword);
        };
        $scope.flag = false;

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
            $scope.ProfilegridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ProfilegridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ProfilegridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.InsertRowInline = function () {
            $scope.editType = "i";
            var row = $scope.copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.ProfilegridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ProfilegridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ProfilegridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.gridApi.grid.rows[0].inlineEdit.enterEditMode();
        }

        $scope.editRow = function (row) {
            $scope.editType = "u";
            var index = $scope.ProfilegridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.ProfilegridOptions.data[index].editrow = !$scope.ProfilegridOptions.data[index].editrow;
        };
        $scope.saveRow = function (row) {
            var index = $scope.ProfilegridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.ProfilegridOptions.data[index].editrow = !$scope.ProfilegridOptions.data[index].editrow;

            if ($scope.editType == "i") {
                $scope.insertData(row);
            } else
                $scope.updateData(row);
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            //var index = $scope.ProfilegridOptions.data.indexOf(row);

            //if ($scope.editType == "i") {
            //    $scope.ProfilegridOptions.data.splice(0, 1);
            //} else {

            //    if (index > 0) {
            //        if (row != null) {
            //            //  $scope.MyLoggridOptions.data.splice(0, 1);
            //            var keys = Object.keys($scope.row);
            //            keys.forEach(function (k) {
            //                $scope.ProfilegridOptions.data[index][k] = $scope.row[k];
            //            });
            //            //Use that to set the editrow attrbute value to false
            //            $scope.ProfilegridOptions.data[index].editrow = false;
            //        }
            //    }
            //}
            //$scope.editType = "";
            //$scope.SelectedRow.entity.editrow = false;
            //$rootScope.$broadcast("SysToaster", 'info', "", "Row editing cancelled");
        };


        $scope.$on("ProfileUploaded", function (event, row) {
            $scope.row.photo = row.photo;
          //  console.log($scope.row);
        });

        $scope.$on("ProfileUpdate", function (event, row) {
            $scope.updateData(row)
        });
        $scope.$on("ProfileInsert", function (event, row) {
            $scope.insertData(row);
        });
        $scope.$on("ProfileDelete", function (event, id, text) {
            $scope.deleteIt(id, text)
        });

        $scope.$on("ProfileCancel", function (event, row) {
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
                type: 'POST', url: km.model.urls["Profile_insert"], data: row, success: function (result) {
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
                $scope.ProfilegridOptions.data.splice(0, 1);
            }
            if ($scope.ProfilegridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.ProfilegridOptions.data.splice($scope.ProfilegridOptions.data.length - 1, 1);
            }
            $scope.editType = "";
            $scope.ProfilegridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ProfilegridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ProfilegridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
            $scope.ProfilegridOptions.totalItems = $scope.ProfilegridOptions.totalItems + 1;
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
                type: 'POST', url: km.model.urls["Profile_delete"], data: parms, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        $scope.afterDelete(r);
                    }
                    $scope.showResult(result, "Delete");
                }
            });
        }
        $scope.afterDelete = function (row) {
            if ($scope.ProfilegridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.ProfilegridOptions.data.push(row);
            }
            $scope.ProfilegridOptions.totalItems = $scope.ProfilegridOptions.totalItems - 1;
            $scope.ProfilegridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.ProfilegridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ProfilegridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.updateData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["Profile_update"], data: row, success: function (result) {
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
            $rootScope.$broadcast("ProfileSelectedRowChanged", $scope.row);
        };
        $scope.EditSide = function (row) {
            row.EditType = "Update";
            console.log(row);
            $scope.SelectedRow = row;
            row.editrow = true;
            $rootScope.$broadcast("ProfileEditSide", row);
        };
        $scope.InsertSide = function () {

            var row = $scope.copyEmptyObject($scope.row);
            row.EditType = "Insert";
            row.editrow = true;
            $rootScope.$broadcast("ProfileEditSide", row);
        };
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
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


        $scope.ProfilegridOptions = {
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
                        field: 'add_by', displayName: 'Add By', width: 80, align: 'center',
                    },
                    {
                        field: 'add_on', displayName: 'Add On', width: 80, align: 'center',
                    },
                    {
                        field: 'background', displayName: 'Background', width: 80, align: 'center',
                    },
                    {
                        field: 'context', displayName: 'Context', width: 80, align: 'center',
                    },
                    {
                        field: 'id', displayName: 'Id', width: 80, align: 'center',
                    },
                    {
                        field: 'skills', displayName: 'Skills', width: 80, align: 'center',
                        cellTemplate: "<div>{{grid.appScope.TranslateToText('reading,writing,orial english',row.entity.skills)}}</div>"
                    },
                    {
                        field: 'title', displayName: 'Title', width: 80, align: 'center',
                    },
                    {
                        field: 'user_id', displayName: 'User Id', width: 80, align: 'center',
                    },
                    {
                        name: 'sActions ', field: 'edit', enableFiltering: false, enableSorting: false, enableColumnMenu: false,
                        cellTemplate: '<div><button  ng-show="!row.entity.editrow"   class="btn primary" ng-click="grid.appScope.EditSide(row.entity)"><ifa-edit"><i class="fa fa-edit"></i></button>' +  //Edit Button
                            '<button  ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.delete(row.entity.id)"><i class="fa fa-trash"></i></button>' +//Save Button
                            '</div>', width: 80
                    }

                ],

            onRegisterApi: function (gridApi) {
                $scope.init();
                console.log(gridApi);
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = "";
                    } else {
                        paginationOptions.order = sortColumns[0].sort.direction;
                        paginationOptions.sort = sortColumns[0].field;
                    }


                    console.log("sortChanged");
                    $scope.getPage();
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;


                    console.log("paginationChanged");
                    $scope.getPage();
                });
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    // var msg = 'row selected ' + row.;
                    $scope.SelectedRow = row;
                    $scope.row = Object.assign({}, row.entity);
                    $scope.selectedRowIndex = $scope.ProfilegridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
            }
        };
        var counter=0
        $scope.getPage = function () {
            console.log(counter++);
            $http.get(km.model.urls["Profile_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order + "&user_id=" + 0 + "&_t=" + com.settings.timestamp()).success(function (result) {
                    console.log(result);
                    if (Array.isArray(result.rows)) {
                        result.rows.forEach(function (d) {
                            d.editrow = false;
                            d.context = d.context.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
                            $scope.showInsert = false;
                        });
                        $scope.ProfilegridOptions.data = result.rows;
                        $scope.GetIDS();

                    }
                    else {

                        $scope.showInsert = true;
                        $scope.ProfilegridOptions.data = [];
                    }
                     $scope.ProfilegridOptions.totalItems = result.total;
                    $scope.gridApi.grid.modifyRows($scope.ProfilegridOptions.data);

                    if ($scope.ProfilegridOptions.data.length > 0)
                        $scope.gridApi.selection.selectRow($scope.ProfilegridOptions.data[0]);
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

            $.each($scope.ProfilegridOptions.data, function (index, item) {
                names.push(item.id);
            });

            if (names.length == 0)
                $scope.ids = "0"
            else
                $scope.ids = names.join(",");
        }
        $scope.init = function () {

            if ($scope.flag == false) {

                $scope.getPage();
                $scope.flag = true;
            }
        }
     //   $scope.init();
    }
]);

