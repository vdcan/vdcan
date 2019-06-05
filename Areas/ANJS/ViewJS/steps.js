
/*
//------------------------------------------------------------------------------ 
//        Date  2019-06-05
//        Author  蔡捷   
//			 				steps 
//        File  steps.cshtml  Page file  
//        File  steps.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/steps.js
 Description steps(steps)  js File 
*/
// Current page object 
var km = {}; 
km.init = function () {
}
 

   
 
//------------------------------------------------------------------------------ 
//       ʱ�� 2019-06-05
//       ���� 蔡捷   
//			   
//------------------------------------------------------------------------------  
 
app.controller('stepsDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', function ($scope, $rootScope, $stateParams, $modal, $http) {
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
    /*$rootScope.$on("stepsSelectedRowChanged", function (event, row, ids, paginationOptions) {
        $scope.row = Object.assign({}, row);
        $scope.row_old = row;
        $(".tmpHide").removeClass("tmpHide");
    });   

    $rootScope.$on("stepsEditSide", function (event, row) {
        $scope.row = Object.assign({}, row);
        $(".stepsDetailButtons").show();
    });     */ 
    $scope.save = function () {
    	
    	
    	  com.ajax({
                type: 'POST', url: km.model.urls["steps_edit"], data: row, success: function (result) {
                    if (result.s) {
                       
                       
						        $(".MyLogDetailButtons").hide(); 
						        $scope.row.editrow = false;
        
                    }
                    $scope.showResult(result, "Insert");
                }
            });
             
    }
    $scope.cancel = function () { 
    	
        $rootScope.$broadcast("stepsCancel", $scope.row);
        $("stepsDetailButtons").hide();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }
    
}]);  
