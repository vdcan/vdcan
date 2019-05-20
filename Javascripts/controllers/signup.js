'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    
    $scope.signup = function () {
        console.log($scope.user)
      $scope.authError = null;
      // Try to create
        $http.post('/home/RegisterMe', { name: $scope.user.name, email: $scope.user.email, password: $scope.user.password, user_code: $scope.user.user_code})
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