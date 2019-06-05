'use strict';

// signup controller
app.controller('StepFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.user.type ="teacher";
    $scope.authError = null;

    $http.post('http://ip-api.com/json/'+gIP,  )
        .then(function (response) {
            console.log(response.data); 

            var d = new Date();
            var n = d.getTimezoneOffset();
            var n2 = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log(n2 + n);
            console.log(d.toUTCString())
        //if ( !response.data.s ) {
        //    $scope.authError = response.data.message;
        //}else{
        //    $state.go('access.signin');
        //}
      }, function(x) {
      //  $scope.authError = 'Server Error';
        });


    $scope.LogOut= function (){
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

    //$scope.slider = {
    //    value: 'E',
    //    options: {
    //        stepsArray: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') // equals to ['A', 'B', ... 'Z']
    //    }
    //};
    //$scope.signup = function () {
    //    console.log($scope.user)
    //  $scope.authError = null;
    //  // Try to create
    //    $http.post('/home/RegisterMe', { type: $scope.user.type ,  name: $scope.user.name, email: $scope.user.email, password: $scope.user.password, user_code: $scope.user.user_code})
    //  .then(function(response) {
    //    if ( !response.data.s ) {
    //        $scope.authError = response.data.message;
    //    }else{
    //        $state.go('access.signin');
    //    }
    //  }, function(x) {
    //    $scope.authError = 'Server Error';
    //  });
    //};
  }])
 ;