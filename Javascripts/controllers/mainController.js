'use strict';


// signup controller
app.controller('mainController2', ['$scope', '$http', '$state', '$interval', function ($scope, $http, $state, $interval) {
    $scope.user = gUserInfo;

    $interval(callAtInterval, 30000);

    function callAtInterval() {


        $http.post('/Login/CheckLogin', { _t: com.settings.timestamp() }).then(function (response) {
            //console.log(response); 
            // console.log("logoff");
            if (!response.data.s) {
                console.log("logoff");
                $state.go('access.signin');

            }
        }, function (x) {
            $scope.authError = 'Server Error';
        });

    } 
}])
// signup controller
app.controller('mainController', ['$scope', '$http', '$state','$interval', function ($scope, $http, $state, $interval) {
    $scope.user = gUserInfo;  

    
    /*
'ngWebsocket', $websocket


    var ws = $websocket.$new({
        url: 'ws://localhost:12345',
        mock: {
            fixtures: {
                'custom event': {
                    data: 'websocket server mocked response'
                },
                'another event': {
                    data: {
                        damn: 'dude',
                        that: 'is awesome!'
                    }
                }
            }
        }
    });

    ws.$on('$open', function () {
        ws.$emit('an event', 'a parrot response') // by default it responde with the same incoming data
            .$emit('custom event') // otherwise it uses the given fixtures
            .$emit('another event'); // even for objects
    })
        .$on('an event', function (message) {
            console.log(message); // it prints 'a parrot response'
        })
        .$on('custom event', function (message) {
            console.log(message); // it prints 'websocket server mocked response'
        })
        .$on('another event', function (message) {
            console.log(message); // it prints the object {damn: 'dude', that: 'is awesome!'}
        });

*/

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


//    ;


//app.factory('MyService', ['$q', '$rootScope', function ($q, $rootScope) {
//    // We return this object to anything injecting our service
//    var Service = {};
//    // Keep all pending requests here until they get responses
//    var callbacks = {};
//    // Create a unique callback ID to map requests to responses
//    var currentCallbackId = 0;
//    // Create our websocket object with the address to the websocket
//    var ws = new WebSocket("ws://localhost:8000/socket/");

//    ws.onopen = function () {
//        console.log("Socket has been opened!");
//    };

//    ws.onmessage = function (message) {
//        listener(JSON.parse(message.data));
//    };

//    function sendRequest(request) {
//        var defer = $q.defer();
//        var callbackId = getCallbackId();
//        callbacks[callbackId] = {
//            time: new Date(),
//            cb: defer
//        };
//        request.callback_id = callbackId;
//        console.log('Sending request', request);
//        ws.send(JSON.stringify(request));
//        return defer.promise;
//    }

//    function listener(data) {
//        var messageObj = data;
//        console.log("Received data from websocket: ", messageObj);
//        // If an object exists with callback_id in our callbacks object, resolve it
//        if (callbacks.hasOwnProperty(messageObj.callback_id)) {
//            console.log(callbacks[messageObj.callback_id]);
//            $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
//            delete callbacks[messageObj.callbackID];
//        }
//    }
//    // This creates a new callback ID for a request
//    function getCallbackId() {
//        currentCallbackId += 1;
//        if (currentCallbackId > 10000) {
//            currentCallbackId = 0;
//        }
//        return currentCallbackId;
//    }

//    // Define a "getter" for getting customer data
//    Service.getCustomers = function () {
//        var request = {
//            type: "get_customers"
//        }
//        // Storing in a variable for clarity on what sendRequest returns
//        var promise = sendRequest(request);
//        return promise;
//    }

//    return Service;
//}])