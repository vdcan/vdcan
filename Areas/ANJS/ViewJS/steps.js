
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
  
app.controller('stepsDetailCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$http', function ($scope, $rootScope, $stateParams, $modal, $http) {
    /*  var id = $stateParams.id;
      var number = $stateParams.number;
      console.log(id);
      console.log(number);
      */


    $scope.LogOut = function () {
        $http.post('/Login/LogOff', {}).then(function (response) {
            //   console.log(response); 
            //console.log("logoff");
            //console.log(document.URL);
            //if (document.URL.indexOf("Login") < 0)
            document.location = "/";
        }, function (x) {
            $scope.authError = 'Server Error';
        });

    }

    $scope.loader = function (param) { 
        return $http.get(km.model.urls["loader"] + "&loader=" + param.myloader+"&value=" + param.keyword);
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
        //console.log($scope.DDLData);
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
    	
    	  $http({
            method: 'POST',
            url: km.model.urls["steps_edit"],
            data: $scope.row
          }).then(function successCallback(response) {



              $(".is-active").removeClass("is-active");
              $(".st2").addClass("is-active");
              document.location = "/home?mc=steps#/access/" + response.data.dt[0]["mystatus"]; 

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
    $scope.load = function () {
    	var row={id: 0}
    	
    	  $http({
            method: 'POST',
            url: km.model.urls["steps_detail"],
            data: row
          }).then(function successCallback(response) { 

            //  console.log(response);
              $scope.GetUserInfo(response.data[0]);


        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            }); 
    	  
    }
    $scope.GetUserInfo= function (data){



        //$scope.row = Object.assign({}, data);
        //$scope.row.editrow = true;
        //$scope.row_old = data;

        if (data["mystatus"] != "steps") {
           // console.log(data["mystatus"]);
           // console.log(data);
            document.location = "/home?mc=steps#/access/" + data["mystatus"];
            return;
        }
        $http.post('http://ip-api.com/json/' + gIP)
            .then(function (response) {

                var d = new Date();
                var n = d.getTimezoneOffset();
                var n2 = Intl.DateTimeFormat().resolvedOptions().timeZone;


               // console.log(n2 + n);
                //console.log(d.toUTCString())


                var keys = Object.keys(response.data);
                keys.forEach(function (k) {
                    data[k] = response.data[k];
                });
                data["state"] = response.data["regionName"];
                data["time_zone_offset"] = n;
                data["time_zone"] = response.data["timezone"];

                console.log(data);
        $scope.row = Object.assign({}, data);
        $scope.row.editrow = true;
        $scope.row_old = data;
               
            }, function (x) {
                //  $scope.authError = 'Server Error';
            });
    }
    
    $scope.load();
    
    $scope.cancel = function () { 
    	
        $rootScope.$broadcast("stepsCancel", $scope.row);
        $("stepsDetailButtons").hide();
        $scope.row = Object.assign({}, $scope.row_old);
        $scope.row.editrow = false;
    }
    
}]);  
