'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', '$timeout', function ($scope, $http, $state, $timeout) {
    $scope.user = {};

    $http.post('/Login/LogOff', {}).then(function (response) {
        //   console.log(response); 
        console.log("logoff");
        console.log(document.URL);
        if (document.URL.indexOf("Login") <0)
        document.location = "/Login";
        }, function (x) {
            $scope.authError = 'Server Error';
        });

    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      // Try to login





        //obj.user_code = $("#UserCode").val();
        //obj.password = $("#Password").val();
        //obj.loginstate = $("#loginstate option:selected").text();
        //if (obj.user_code == "") { layer.msg(gDictionary["please_input_account"]); return; }
        //if (obj.password == "") { layer.msg(gDictionary["please input password"]); return; }
        //// if (obj.ip != '182.50.119.140') { layer.msg('抱歉，您的ip无法进入系统'); return; }
        //$(".login_msg").html('<span style="color:red; font-weight:bold"><img src="/Content/images/ajax-loader.gif" />' + gDictionary["logining"] + '</span>');
        //com.ajax({
        //    url: '/Login/Login', data: JSON.stringify(obj), showLoading: false, success: function (result) {
        //        // alert(JSON.stringify(result))
        //        if (result.s == 0) {
        //            //com.message('s', result.emsg);
        //            $(".login_msg").html('<span style="color:green; font-weight:bold"><img src="/Content/images/ajax-loader.gif" />' + gDictionary["success"] + '.</span>');
        //            window.location.href = '/home/admin';//+ com.settings.ajax_timestamp();
        //        } else {
        //            layer.msg(result.message);
        //        }
        //    }
        //})
        var obj = {
            user_code: $scope.user.email, password: $scope.user.password,
            ip: "", city:""
        };
      //  console.log(obj);
        $http.post('/Login/Login', obj).then(function (response) {
        //    console.log(response);
            if (response.data.s == 0) {

             //   dashboard-v1
          //$state.go('app.dashboard-v1');

                window.location.href = "/home/admin?mc=admin#/app/dashboard-v1";
        }else{
          $scope.authError = 'Email or Password not right';
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
;