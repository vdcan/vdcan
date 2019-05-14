
/*
//------------------------------------------------------------------------------ 
//        Date  2019-05-14
//        Author  蔡捷   
//			 				Angular Side 
//        File  angular_side.cshtml  Page file  
//        File  angular_side.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/angular_side.js
 Description Angular Side(angular_side)  js File 
*/
// Current page object 
var km = {};
km.model = null;
km.parent_model = null;
 

 
//------------------------------------------------------------------------------ 
//        Date  2019-05-14
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  
 
 
function  MyLog_8_Init(){ 
	
}


 
  


angular.module('ui.grid').factory('InlineEdit', ['$interval', '$rootScope', 'uiGridRowEditService',
    function ($interval, $rootScope, uiGridRowEditService) {
        function inlineEdit(entity, index, grid) {
            this.grid = grid;
            this.index = index;
            this.entity = {};
            this.isEditModeOn = false;
            this.init(entity);
        }

        inlineEdit.prototype = {
            init: function (rawEntity) {
                var self = this;

                for (var prop in rawEntity) {
                    self.entity[prop] = {
                        value: rawEntity[prop],
                        isValueChanged: false,
                        isSave: false,
                        isCancel: false,
                        isEdit: false
                    }
                }
            },

            enterEditMode: function (event) {
                event && event.stopPropagation();
                var self = this;
                self.isEditModeOn = true;
                console.log("enterEditMode");
                // cancel all rows which are in edit mode
                self.grid.rows.forEach(function (row) {
                    if (row.inlineEdit && row.inlineEdit.isEditModeOn && row.uid !== self.grid.rows[self.index].uid) {
                        row.inlineEdit.cancelEdit();
                    }
                });

                // Reset all the values
                for (var prop in self.entity) {
                    self.entity[prop].isSave = false;
                    self.entity[prop].isCancel = false;
                    self.entity[prop].isEdit = true;
                }
            },

            saveEdit: function (event) {
                event && event.stopPropagation();
                var self = this;



                self.isEditModeOn = false;

                for (var prop in self.entity) {
                    self.entity[prop].isSave = true;
                    self.entity[prop].isEdit = false;
                }
                //   console.log( self.entity[prop]);
                //  $rootScope.$broadcast("MyLogUpdate",null);
                uiGridRowEditService.saveRow(self.grid, self.grid.rows[self.index])();
            },

            cancelEdit: function (event) {
                event && event.stopPropagation();
                var self = this;

                self.isEditModeOn = false;
                for (var prop in self.entity) {
                    self.entity[prop].isCancel = true;
                    self.entity[prop].isEdit = false;
                }
                
                $rootScope.$broadcast("MyLogCancel", null);
            }
        }

        return inlineEdit;
    }]);

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
    $rootScope.$on("MyLogSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row ); 
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
        console.log("ipchanged:"+$scope.row.ip);
    }

});
*/




//------------------------------------------------------------------------------ 
//        Date  2019-05-14
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  

app.controller('MyLogDetailCtrl3', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', function ($scope, $rootScope, $stateParams, $modal, $http) {
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
    $scope.row = {};// = {id:43124};
    $scope.row_old = {};// = {id:43124};
    //$scope.row_original = {};// = {id:43124};
    $rootScope.$on("MyLogSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row);
        $scope.row_old = row;
        $(".tmpHide").removeClass("tmpHide");
    });
    $rootScope.$on("MyLogEditSide", function (event, row) {
        $scope.row = Object.assign({}, row);
        $(".MyLogDetailButtons").show();
    });
    $scope.save = function () {
        $rootScope.$broadcast("MyLog" + $scope.row.EditType, $scope.row);
        $(".MyLogDetailButtons").hide();
        $scope.row.editrow = false;
    }
    $scope.cancel = function () {

        $rootScope.$broadcast("MyLogCancel", $scope.row);
        $(".MyLogDetailButtons").hide();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }

}]);       
 
app.controller('MyLogCtrl3', [
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
      //  console.log(param);
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
            $scope.MyLoggridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.MyLoggridOptions.data);
             $scope.gridApi.selection.selectRow($scope.MyLoggridOptions.data[0]);
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
            var index = $scope.MyLoggridOptions.data.indexOf(row);
            $scope.row = Object.assign({}, row); 
            //Use that to set the editrow attrbute value for seleted rows
            $scope.MyLoggridOptions.data[index].editrow = !$scope.MyLoggridOptions.data[index].editrow; 
        };
        $scope.saveRow = function (row) { 
            var index = $scope.MyLoggridOptions.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            $scope.MyLoggridOptions.data[index].editrow = !$scope.MyLoggridOptions.data[index].editrow; 
         
            if ($scope.editType == "i"){
                $scope.insertData(row);
            }else
                $scope.updateData(row);
        };
        //Method to cancel the edit mode in UIGrid
        $scope.cancelEdit = function (row) {
            //Get the index of selected row from row object
            var index = $scope.MyLoggridOptions.data.indexOf(row);

            if ($scope.editType == "i") {
                $scope.MyLoggridOptions.data.splice(0, 1);
            }else {
            
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
         
        $scope.$on("MyLogUpdate", function (event, row) {
            $scope.updateData(row)
        });
        $scope.$on("MyLogInsert", function (event, row) {
            $scope.insertData(row);
        });
        $scope.$on("MyLogDelete", function (event, id, text) {
            $scope.deleteIt(id, text)
        });

        $scope.$on("MyLogCancel", function (event, row) { 
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
                type: 'POST', url: km.model.urls["MyLog_insert"], data: row, success: function (result) {
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
                $scope.MyLoggridOptions.data.splice(0, 1);
            }
            if ($scope.MyLoggridOptions.totalItems >= (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.MyLoggridOptions.data.splice($scope.MyLoggridOptions.data.length - 1, 1);
            }
            $scope.editType = "";
            $scope.MyLoggridOptions.data.unshift(row);
            $scope.gridApi.grid.modifyRows($scope.MyLoggridOptions.data);
            $scope.gridApi.selection.selectRow($scope.MyLoggridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
            $scope.MyLoggridOptions.totalItems = $scope.MyLoggridOptions.totalItems + 1;
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
                type: 'POST', url: km.model.urls["MyLog_delete"], data: parms, success: function (result) {
                    if (result.s) {
                        var r = result.dt[0];
                        $scope.afterDelete(r);
                    }
                    $scope.showResult(result, "Delete");
                }
            });
        }
        $scope.afterDelete = function (row) {
            if ($scope.MyLoggridOptions.totalItems > (paginationOptions.pageNumber) * paginationOptions.pageSize) {
                $scope.MyLoggridOptions.data.push(row);
            }
            $scope.MyLoggridOptions.totalItems = $scope.MyLoggridOptions.totalItems - 1;
            $scope.MyLoggridOptions.data.splice($scope.selectedRowIndex, 1);
            $scope.gridApi.grid.modifyRows($scope.MyLoggridOptions.data);
            $scope.gridApi.selection.selectRow($scope.MyLoggridOptions.data[0]);
            $scope.gridApi.core.refresh();
            $scope.GetIDS();
        }
        $scope.updateData = function (row) {
            com.ajax({
                type: 'POST', url: km.model.urls["MyLog_update"], data: row, success: function (result) {
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
            $rootScope.$broadcast("MyLogSelectedRowChanged", $scope.row );
        };
        $scope.EditSide = function (row) {
        		row.EditType ="Update";
        		
            $scope.SelectedRow = row;
            row.editrow = true;
            $rootScope.$broadcast("MyLogEditSide", row );
        };
        $scope.InsertSide = function ( ) {
        		
            var row = $scope.copyEmptyObject($scope.row);
        		row.EditType ="Insert";
            $rootScope.$broadcast("MyLogEditSide", row );
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
        
        
        $scope.MyLoggridOptions = {
            paginationPageSizes: [10, 15, 25, 50, 75],
            paginationPageSize: paginationOptions.pageSize,
            enableRowSelection: true,
            useExternalPagination: true,
            useExternalSorting: true,
            multiSelect: false,
            enableRowHeaderSelection: false,
            columnDefs: 
                [ 
                 { field: 'action', displayName: 'Action', width: 80, align: 'center',
    },
  { field: 'action_data', displayName: 'Action Data', width: 80, align: 'center',
    },
  { field: 'add_by', displayName: 'Add By', width: 80, align: 'center',
    },
  { field: 'add_on', displayName: 'Add On', width: 80, align: 'center',
    },
  { field: 'app_code', displayName: 'App Code', width: 80, align: 'center',
  cellTemplate:"<div>{{grid.appScope.TranslateToText(grid.appScope.DDLData['client'],row.entity.app_code)}}</div>"  },
  { field: 'flag', displayName: 'Flag', width: 80, align: 'center',
  cellTemplate:"<label class='i-switch m-t-xs m-r'> <input type='checkbox'   ng-disabled='true'  ng-model='row.entity.flag' checked>  <i></i> </label>",  },
  { field: 'id', displayName: 'Id', width: 80, align: 'center',
    },
  { field: 'ip', displayName: 'Ip', width: 80, align: 'center',
  cellTemplate:"<div>{{grid.appScope.TranslateToText('0=inactive 1=active',row.entity.ip)}}</div>"  },
  { field: 'menu_code', displayName: 'Menu Code', width: 80, align: 'center',
    },
 {
                        name: 'sActions ', field: 'edit', enableFiltering: false, enableSorting: false, enableColumnMenu: false,
                        cellTemplate: '<div><button  ng-show="!row.entity.editrow"   class="btn primary" ng-click="grid.appScope.EditSide(row.entity)"><ifa-edit"><i class="fa fa-edit"></i></button>' +  //Edit Button
                            '<button  ng-show="!row.entity.editrow" class="btn primary" ng-click="grid.appScope.delete(row.entity.id)"><i class="fa fa-trash"></i></button>' +//Save Button
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
                    $scope.selectedRowIndex = $scope.MyLoggridOptions.data.indexOf(row.entity);
                    $scope.sync();
                });
                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                });
              }
        };
       
        $scope.getPage = function () {
            $http.get(km.model.urls["MyLog_pager"] + "&page=" + paginationOptions.pageNumber
                + "&rows=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&order=" +
                paginationOptions.order +   "&_t="+com.settings.timestamp()).success(function (result) {
   	 								result.rows.forEach(function (d) {
                        d.editrow = false;
                    });
                    $scope.MyLoggridOptions.totalItems  = result.total;
                    $scope.MyLoggridOptions.data = result.rows;
                    $scope.GetIDS();
                    $scope.gridApi.grid.modifyRows($scope.MyLoggridOptions.data);

                    if ($scope.MyLoggridOptions.data.length >0)
                        $scope.gridApi.selection.selectRow($scope.MyLoggridOptions.data[0]);
                });
        }
        $scope.copyEmptyObject =function(source, isArray) {
            var o = Array.isArray(source) ? [] : {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    var t = typeof source[key];
                    o[key] = t == 'object' ? skeleton(source[key]) : { string: '', number: 0, boolean: false }[t];
                }
            }
            return o;
        }
        $scope.GetIDS = function () {
            var names = [];

            $.each($scope.MyLoggridOptions.data, function (index, item) {
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
 
