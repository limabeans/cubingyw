var SPACEBAR = 32;

var app = angular.module('cubingjApp', ['ui.bootstrap']);

// controller for the home page and links page
app.controller('contestController', function($scope, $http, $interval) {

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

  // ping the server on an interval to show that the user is currently present
  $interval(function() {
    $http.post('/userTimeStamp').success(function(response) {
      $scope.users = response;
    });
  }, 1000);

  $scope.results =[];

  $scope.results[0] = [];
  $scope.results[1] = [];
  $scope.results[2] = [];

  $scope.results[0][0] = {};
  $scope.results[0][1] = {};
  $scope.results[1][0] = {};
  $scope.results[1][1] = {};
  $scope.results[2][0] = {};
  $scope.results[2][1] = {};

  $scope.results[0][0].firstName = 'Tim';
  $scope.results[0][0].lastName = 'Wong';
  $scope.results[0][0].time = '6.25';
  $scope.results[0][0].penalty = '(+2)';
  $scope.results[0][0].comment = 'omg puss two';

  $scope.results[0][1].firstName = 'Angel';
  $scope.results[0][1].lastName = 'Lim';
  $scope.results[0][1].time = '15.82';
  $scope.results[0][1].penalty = '';
  $scope.results[0][1].comment = '';

  $scope.results[1][0].firstName = 'Tim';
  $scope.results[1][0].lastName = 'Wong';
  $scope.results[1][0].time = '8.48';
  $scope.results[1][0].penalty = '';
  $scope.results[1][0].comment = 'yuh wuh';

  $scope.results[1][1].firstName = 'Angel';
  $scope.results[1][1].lastName = 'Lim';
  $scope.results[1][1].time = '13.38';
  $scope.results[1][1].penalty = '';
  $scope.results[1][1].comment = 'gooood';

  $scope.results[2][0].firstName = 'Tim';
  $scope.results[2][0].lastName = 'Wong';
  $scope.results[2][0].time = '12.53';
  $scope.results[2][0].penalty = '';
  $scope.results[2][0].comment = 'uh oh riley time';

  $scope.results[2][1].firstName = 'Angel';
  $scope.results[2][1].lastName = 'Lim';
  $scope.results[2][1].time = '18.28';
  $scope.results[2][1].penalty = '(DNF)';
  $scope.results[2][1].comment = 'yolo';

  //$scope.results = [];
  //
  //$scope.results[0] = {};
  //$scope.results[1] = {};
  //
  //$scope.results[0].firstName = 'Tim';
  //$scope.results[0].lastName = 'Wong';
  //
  //$scope.results[1].firstName = 'Angel';
  //$scope.results[1].lastName = 'Lim';
  //
  //$scope.results[0].solves = [];
  //$scope.results[0].solves[0] = {};
  //$scope.results[0].solves[0].time = '6.25';
  //$scope.results[0].solves[0].penalty = '(+2)';
  //$scope.results[0].solves[0].comment = 'omg puss two';
  //$scope.results[0].solves[1] = {};
  //$scope.results[0].solves[1].time = '12.69';
  //$scope.results[0].solves[1].penalty = '';
  //$scope.results[0].solves[1].comment = 'uh oh riley time';
  //$scope.results[0].solves[2] = {};
  //$scope.results[0].solves[2].time = '8.48';
  //$scope.results[0].solves[2].penalty = '';
  //$scope.results[0].solves[2].comment = 'yw';
  //
  //$scope.results[1].solves = [];
  //$scope.results[1].solves[0] = {};
  //$scope.results[1].solves[0].time = '18.28';
  //$scope.results[1].solves[0].penalty = '(DNF)';
  //$scope.results[1].solves[0].comment = 'yolo';
  //$scope.results[1].solves[1] = {};
  //$scope.results[1].solves[1].time = '15.25';
  //$scope.results[1].solves[1].penalty = '';
  //$scope.results[1].solves[1].comment = 'dgaf';
  //$scope.results[1].solves[2] = {};
  //$scope.results[1].solves[2].time = '20.25';
  //$scope.results[1].solves[2].penalty = '';
  //$scope.results[1].solves[2].comment = 'dgaf';


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


