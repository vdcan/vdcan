'use strict';

// signup controller
app.controller('StepFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.user.type ="teacher";
    $scope.authError = null;


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