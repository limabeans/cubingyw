var SPACEBAR = 32;

var app = angular.module('cubingjApp', ['ui.bootstrap']);

// controller for the home page and links page
app.controller('contestController', function($scope, $http, $interval) {

    // ping the server on an interval to show that the user is currently present
    $interval(function() {
        $http.post('/userTimeStamp').success(function(response) {
            $scope.users = response;
        });
    }, 1000);

    // get authorization status
    $scope.authStatus = '';
    $http.get('/authStatus').success(function(response) {
    if (response.status == 'connected')
        $scope.authStatus = 'Logout';
    else
        $scope.authStatus = 'Login';
    });

    // GET request of userlist from the server
    $http.get('/userList').success(function(response) {
        $scope.users = response;
    });

  // code involving the timer

  $scope.now = 0; // updated using Date.now()
  $scope.time = 0;
  $scope.timer_display=0.000;
  $scope.timer_delay = 10;
  $scope.interval = null;


  $scope.spacePressed = function(event) {
    if(event.which === SPACEBAR) {
      if(!$scope.interval) {
        // start of solve
        $scope.time = 0.000;
        $scope.start();
      } else {
        // end of solve
        $scope.stop();
        $scope.interval = null;
        console.log($scope.time);

        var solveObject = {
          solveTime: $scope.time,
          solveType: '3x3x3'
        };
        
        // $http.post('/newSolve', solveObject).success(function(response) {
        //     //$scope.users = response;
        // });

        
      }
    }
  };

  $scope.start = function() {
    $scope.now = Date.now();

    $scope.interval = $interval(function() {
      var tmp = Date.now();
      var offset = tmp - $scope.now;
      $scope.time += (offset);
      $scope.timer_display = ($scope.time/1000).toFixed(3);
      $scope.now = tmp;
    }, $scope.timer_delay);
  };

  $scope.stop = function() {
    $interval.cancel($scope.interval);
  }

  // end of timer code

});


// facebook
window.fbAsyncInit = function() {
  FB.init({
    appId: '1397096627278092',
    cookies: true,
    xfbml: true,
    version: 'v2.3'
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


