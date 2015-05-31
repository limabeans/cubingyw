var app = angular.module('cubingjApp', ['ui.bootstrap']);

// controller for the home page and links page
app.controller('cubingjController', function($scope, $http) {

    // get authorization status
    $scope.authStatus = 'Login';
    $http.get('/authStatus').success(function(response) {
        if (response.status == 'connected')
            $scope.authStatus = 'Logout';
        else
            $scope.authStatus = 'Login';
    });

});
