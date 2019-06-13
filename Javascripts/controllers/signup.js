'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.user.type ="teacher";
    $scope.authError = null;


    $scope.slider = {
        value: 'E',
        options: {
            stepsArray: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') // equals to ['A', 'B', ... 'Z']
        }
    };
    $scope.init = function () {


        if (gIP == "::1" || gIP.startsWith("192.168."))
            gIP = "59.110.148.199";
        $http.post('http://ip-api.com/json/' + gIP)
            .then(function (response) {

                var d = new Date();
                var n = d.getTimezoneOffset() / -60;
                var n2 = Intl.DateTimeFormat().resolvedOptions().timeZone;

                //var keys = Object.keys(response.data);
                //keys.forEach(function (k) {
                //    data[k] = response.data[k];
                //});
                $scope.user.region= response.data["regionName"];
                $scope.user.timezone_offset = n;
                $scope.user.timezone = response.data["timezone"];
                $scope.user.country = response.data["country"];
                $scope.user.city = response.data["city"];
                $scope.user.ip = gIP;
            });

    }
    $scope.init();
    $scope.signup = function () {

          
    //    console.log($scope.user)
      $scope.authError = null;
      // Try to create
        $http.post('/home/RegisterMe', $scope.user//{ type: $scope.user.type, name: $scope.user.name, email: $scope.user.email, password: $scope.user.password, user_code: $scope.user.user_code }
        )
      .then(function(response) {
        if ( !response.data.s ) {
            $scope.authError = response.data.message;
        }else{
            $state.go('access.signin');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
 ;