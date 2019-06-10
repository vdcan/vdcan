
/*
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			 				Class Admin 
//        File  class_admin.cshtml  Page file  
//        File  class_admin.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/class_admin.js
 Description Class Admin(class_admin)  js File 
*/
// Current page object 
var km = {}; 
km.init = function () {
}
 

   
 
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  
 
app.controller('ClassAdminDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', function ($scope, $rootScope, $stateParams, $modal, $http) {
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
    $rootScope.$on("ClassAdminSelectedRowChanged", function (event, row, ids, paginationOptions) {

        row.CONTEXT = row.CONTEXT.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
        $scope.row = Object.assign({}, row);
        $scope.row_old = row;
        $(".tmpHide").removeClass("tmpHide");
    });    
    $rootScope.$on("ClassAdminEditSide", function (event, row) {
        $scope.row = Object.assign({}, row);
        $(".ClassAdminDetailButtons").show();
    }); 
    $scope.save = function () {
        $rootScope.$broadcast("ClassAdmin"+$scope.row.EditType, $scope.row);
        $(".ClassAdminDetailButtons").hide(); 
        $scope.row.editrow = false;
    }
    $scope.cancel = function () { 
    	
        $rootScope.$broadcast("ClassAdminCancel", $scope.row);
        $(".ClassAdminDetailButtons").hide();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }
    
}]);  

 
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  
 
 
function  ClassAdmin_8_Init(){ 
	
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
    $rootScope.$on("ClassAdminSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row ); 
        $(".tmpHide").removeClass("tmpHide");
    });
    $scope.insert = function () {  
        $rootScope.$broadcast("ClassAdminInsert", $scope.row);
    };
    $scope.delete = function (id) {
        $rootScope.$broadcast("ClassAdminDelete", $scope.row.id, $scope.row.id);
    };
    $scope.update = function () {
        $rootScope.$broadcast("ClassAdminUpdate", $scope.row);
    }; 
    //$scope.$watch("row.ip", function (newValue, oldValue) {
    //    console.log("$watch:"+newValue); 
    //});

    $scope.ipchanged = function () {
        console.log("ipchanged:"+$scope.row.ip);
    }

});
*/

       
 
app.controller('ClassAdminCtrl', [
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
            $scope.ClassAdmingridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ClassAdmingridOptions.data);
             $scope.gridApi.selection.selectRow($scope.ClassAdmingridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
         $scope.InsertRowInline = function () { 
            $scope.editType = "i";
            var row = $scope.copyEmptyObject($scope.row);
            row.editrow = true;
            $scope.ClassAdmingridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ClassAdmingridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ClassAdmingridOptions.data[0]);
            $scope.gridApi.core.refresh();
           $scope.gridApi.grid.rows[0].inlineEdit.enterEditMode(); 
        }
        
        $scope.editRow = function (row) {
            $scope.editType = "u";
            var index = $scope.ClassAdmingridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row); 
            //Use that to set the editrow attrbute value for seleted rows
            $scope.ClassAdmingridOptions.data[index].editrow = !$scope.ClassAdmingridOptions.data[index].editrow; 
        };
        $scope.saveRow = function (row) { 
            var index = $scope.ClassAdmingridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.ClassAdmingridOptions.data[index].editrow = !$scope.ClassAdmingridOptions.data[index].editrow; 
         
            if ($scope.editType == "i"){
                $scope.insertData(row);
            }else
                $scope.updateData(row);
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            var index = $scope.ClassAdmingridOptions.data.indexOf(row);

            if ($scope.editType == "i") {
                $scope.ClassAdminridOptions.data.splice(0, 1);
            }else {
            
                if (index > 0) {
	                if (row != null) {
	                    //  $scope.ClassAdmingridOptions.data.splice(0, 1);
	                    var keys = Object.keys($scope.row);
	                    keys.forEach(function (k) {
	                        $scope.ClassAdmingridOptions.data[index][k] = $scope.row[k];
	                    });
	                    //Use that to set the editrow attrbute value to false
	                    $scope.ClassAdmingridOptions.data[index].editrow = false;
	                }
                }
            }
            $scope.editType = "";
            $scope.SelectedRow.entity.editrow = false;
            $rootScope.$broadcast("SysToaster", 'info', "", "Row editing cancelled");
        };
         
        $scope.$on("ClassAdminUpdate", function (event, row) {
            $scope.updateData(row)
        });
        $scope.$on("ClassAdminInsert", function (event, row) {
            $scope.insertData(row);
        });
        $scope.$on("ClassAdminDelete", function (event, id, text) {
            $scope.deleteIt(id, text)
        });

        $scope.$on("ClassAdminCancel", function (event, row) { 
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
                type: 'POST', url: km.model.urls["ClassAdmin_insert"], data: row, success: function (result) {
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
                $scope.ClassAdmingridOptions.data.splice(0, 1);
            }
            if ($scope.ClassAdmingridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.ClassAdmingridOptions.data.splice($scope.ClassAdmingridOptions.data.length - 1, 1);
            }
            $scope.editType = "";
            $scope.ClassAdmingridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.ClassAdmingridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ClassAdmingridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
            $scope.ClassAdmingridOptions.totalItems = $scope.ClassAdmingridOptions.totalItems + 1;
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
                type: 'POST', url: km.model.urls["ClassAdmin_delete"], data: parms, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        $scope.afterDelete(r);
                    }
                    $scope.showResult(result, "Delete");
                }
            });
        }
        $scope.afterDelete = function (row) {
            if ($scope.ClassAdmingridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.ClassAdmingridOptions.data.push(row);
            }
            $scope.ClassAdmingridOptions.totalItems = $scope.ClassAdmingridOptions.totalItems - 1;
            $scope.ClassAdmingridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.ClassAdmingridOptions.data);
            $scope.gridApi.selection.selectRow($scope.ClassAdmingridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.updateData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["ClassAdmin_update"], data: row, success: function (result) {
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
            $rootScope.$broadcast("ClassAdminSelectedRowChanged", $scope.row );
        };
        $scope.EditSide = function (row) {
        		row.EditType ="Update";
        		
            row.editrow = true;
            $scope.SelectedRow = row;
            row.editrow = true;
            $rootScope.$broadcast("ClassAdminEditSide", row );
        };
        $scope.InsertSide = function ( ) {
        		
            var row = $scope.copyEmptyObject($scope.row);
        		row.EditType ="Insert";
        		
            row.editrow = true;
            $rootScope.$broadcast("ClassAdminEditSide", row );
        };
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
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
        
        
        $scope.ClassAdmingridOptions = {
            paginationPageSizes: [10, 15, 25, 50, 75],
            paginationPageSize: paginationOptions.pageSize,
            enableRowSelection: true,
            useExternalPagination: true,
            useExternalSorting: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            columnDefs: 
                [ 
  { field: 'class_title', displayName: 'Class Title', width: "*", align: 'center',
    },
                 { field: 'active_flag', displayName: 'Active Flag', width: 80, align: 'center',
  cellTemplate:"<label class='i-switch m-t-xs m-r'> <input type='checkbox'   ng-disabled='true'  ng-model='row.entity.active_flag' checked>  <i></i> </label>",  },
  { field: 'add_by', displayName: 'Add By', width: 80, align: 'center',
    },
  { field: 'add_on', displayName: 'Add On', width: 80, align: 'center',
    },
  { field: 'class_type', displayName: 'Class Type', width: 80, align: 'center',
 cellTemplate:"<div>{{grid.appScope.TranslateToText('english=english chinese=chinese',row.entity.class_type)}}</div>"  },
  //{ field: 'comments', displayName: 'Comments', width: 80, align: 'center',
  //  },
  //{ field: 'CONTEXT', displayName: 'Context', width: 80, align: 'center',
  //  },
  //{ field: 'id', displayName: 'Id', width: 80, align: 'center',
  //  },
  //{ field: 'method', displayName: 'Method', width: 80, align: 'center',
  //cellTemplate:"<div>{{grid.appScope.TranslateToText('web=web wechat=wechat',row.entity.method)}}</div>"  },
 {
                        name: 'Actions ', field: 'edit', enableFiltering: false, enableSorting: false, enableColumnMenu: false,
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
                    $scope.selectedRowIndex = $scope.ClassAdmingridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
              }
        };
       
        $scope.getPage = function () {
            $http.get(km.model.urls["ClassAdmin_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order +   "&_t="+com.settings.timestamp()).success(function (result) {
   
      if (Array.isArray(result.rows)) {
   	 								result.rows.forEach(function (d) {
                                                    d.editrow = false; 
                                                    d.CONTEXT = d.CONTEXT.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
                        });
                    $scope.ClassAdmingridOptions.data = result.rows;
                    $scope.GetIDS();

                    }else
                     
                    $scope.ClassAdmingridOptions.totalItems  = result.total; 
                    
                    $scope.gridApi.grid.modifyRows($scope.ClassAdmingridOptions.data);

                    if ($scope.ClassAdmingridOptions.data.length >0)
                        $scope.gridApi.selection.selectRow($scope.ClassAdmingridOptions.data[0]);
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

            $.each($scope.ClassAdmingridOptions.data, function (index, item) {
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
 
