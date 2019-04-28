 
var km = {};
km.model = null; 
km.init = function () { 
}
var cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" ng-click="selectItem(row.id)">clickme</div>';
app.controller('GridDemoCtrl', ['$scope', '$http',   function ($scope, $http ) {
    //$scope.filterOptions = {
    //    filterText: "",
    //    useExternalFilter: true
    //}; 
    //$interval(function () {
    //    $scope.gridOptions.selectRow(0, true);
    //    if ($scope.mySelections[0] != undefined)
    //        console.log($scope.mySelections[0]);
    //}, 0, 1);

    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 15, 20,25,30],
        pageSize: 10,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData; 
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, sort, directions) {
        setTimeout(function () {
            var data; 
            $http.get(km.model.urls["SampleFile_pager"] + "&page=" + page + "&rows=" + pageSize + "&sort=" + sort + "&order=" + directions+"&client_id=0").success(function (result) {
                $scope.totalServerItems = result.total;
                //$scope.gridApi.grid.modifyRows($scope.gridOptions.data);
                //$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]); 
                console.log(result.total);
                 
              //  $scope.gridOptions.selectRow(0, true); 

                setTimeout(function () {
                    $scope.gridOptions.selectRow(0, true);
                }, 0);
                 
                flag = false;
                $scope.setPagingData(result.rows, 1, pageSize);
                }); 
        }, 100);
    }; 
    var flag = true;
     $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,"",""); 
    $scope.$watch('pagingOptions', function (newVal, oldVal) { 
        if (flag!=true)
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,
                $scope.sortInfo.fields[0], $scope.sortInfo.directions[0]
            ); 
    }, true); 
    $scope.$watch('sortInfo', function (newVal, oldVal) {
        if (flag != true)
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage,
            newVal.fields[0], newVal.directions[0]); 
        $scope.sortInfo = newVal;
    }, true);  
    $scope.sortInfo = { fields: ['id'], directions: ['asc'] }; 
    $scope.mySelections = [];
    $scope.gridOptions = {
        enableSorting: true,
        afterSelectionChange: function (data) {
            if ($scope.mySelections[0] != undefined)
             console.log($scope.mySelections[0]);
        },
        sortInfo: $scope.sortInfo,
        useExternalSorting: true, 
        columnDefs: [{ field: "id", width: 120, pinned: true, displayName: 'Index' },//, cellTemplate: cellTemplate },
            { field: "sample_file", width: 120 },
            { field: "production_types", width: 120 },
            { field: "add_on", width: 120  }],

        selectedItems: $scope.mySelections,
        enableRowSelection: true,
        enableColumnResize: true,
        multiSelect: false,
        data: 'myData',
        maintainColumnRatios: true,
        primaryKey: 'id',
        enableCellEdit: true,
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        onRegisterApi: function (api) {
            alert('now it work')
            $scope.gridApis.push(api);
        }
    };
    //$scope.gridOptions.onRegisterApi  = function (gridApi) {
    //    console.log("onRegisterApi");
    //    }


}]);



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

