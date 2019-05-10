'use strict';

// signup controller
app.controller('userDetailController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = gUserInfo; 
    //$scope.init = function() { 
    //  // Try to create
    //  $http.post('api/signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
    //      .then(function (response) { 
    //          $scope.user = response.data;
    //  }, function(x) {
    //    $scope.authError = 'Server Error';
    //  }); 
    //};
    //$scope.init();
  }])
 ;