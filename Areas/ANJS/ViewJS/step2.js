
/*
//------------------------------------------------------------------------------ 
//        Date  2019-06-13
//        Author  蔡捷   
//			 				step2 
//        File  step2.cshtml  Page file  
//        File  step2.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/step2.js
 Description step2(step2)  js File 
*/
// Current page object 
var km = {}; 
km.init = function () {
}
 

app.controller('ScheduleDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', function ($scope, $rootScope, $stateParams, $modal, $http) {
    /*  var id = $stateParams.id;
      var number = $stateParams.number;
      console.log(id);
      console.log(number);
      */

    $scope.loader = function (param) {
        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader + "&value=" + param.keyword);
    };
    $scope.DDLData = km.ddls || {};
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
    /*$rootScope.$on("e_scheduleSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row);
        $scope.row_old = row;
        $(".tmpHide").removeClass("tmpHide");
    });   

    $rootScope.$on("e_scheduleEditSide", function (event, row) {
        $scope.row = Object.assign({}, row);
        $(".e_scheduleDetailButtons").show();
    });     */
    $scope.save = function () {

        $http({
            method: 'POST',
            url: km.model.urls["e_schedule_edit"],
            data: $scope.row
        }).then(function successCallback(response) {
            $scope.showResult(response.data, "Save");

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    }

    $scope.showResult = function (result, title) {
        if (result.s) {
            $rootScope.$broadcast("SysToaster", 'success', title, result.message);
        } else {
            $rootScope.$broadcast("SysToaster", 'error', title, result.message);
        }
    }
    $scope.Data = [];
    $scope.load = function () {
        var row = { id: 0 }

        $http({
            method: 'POST',
            url: km.model.urls["MySchedule_list"],
            data: row
        }).then(function successCallback(response) {

            $scope.Data = Object.assign({}, response.data);
            //$scope.row.editrow = true;
            //$scope.row_old = response.data;

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    }

    $scope.load();

    $scope.cancel = function () {

        $rootScope.$broadcast("e_scheduleCancel", $scope.row);
        $("e_scheduleDetailButtons").hide();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }

}]);  
 