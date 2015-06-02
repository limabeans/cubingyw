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

  // express.io global variable
  io = io.connect();

  $scope.solves = [];

  // code involving the timer
  $scope.now = 0; // updated using Date.now()
  $scope.time = 0;
  $scope.timer_display = '0.000';
  $scope.timer_delay = 10;
  $scope.interval = null;

  // hard-coded scramble
  $scope.scramble = "R2 L2 B' D' L D' L2 U2 B' D' R2 U' R' B2 D' F' D L2 R2 U2";

  $scope.isTiming = 0;
  $scope.isKeydown = 0;
  $scope.isTyping = 0;

  $scope.keydown = function(event) {
    if ((event.which === 32) && ($scope.isKeydown === 0) && ($scope.isTyping === 0)) {
      $scope.isKeydown = 1;
      if ($scope.isTiming === 0) {
        $scope.timer_display = '0.000';
        $scope.timerStyle = {'color':'#33CC00'};
      } else if ($scope.isTiming === 1) {
        $scope.stopTimer();
        var solveObject = {
          solveTime: $scope.time,
          solveType: '3x3x3'
        };
        io.emit('finished_solve', solveObject); // send to server after completing solve
        $scope.now = 0;
        $scope.time = 0;
        $scope.interval = null;
      }
    }
  };

  $scope.keyup = function(event) {
    if ((event.which === 32) && ($scope.isKeydown === 1) && ($scope.isTyping === 0)) {
      $scope.isKeydown = 0;
      if ($scope.isTiming === 0) {
        $scope.isTiming = 1;
        $scope.timerStyle = {'color': 'black'};
        $scope.startTimer();
      } else if ($scope.isTiming === 1) {
        $scope.isTiming = 0;
      }
    }
  };

  // receive solve result from server (may not necessarily be you) 
  io.on('solve_result', function(res) {
    $scope.last_solve = res;
    console.log(res);
    $scope.solves.push(res);
  });

  $scope.startTimer = function() {
    $scope.now = Date.now();

    $scope.interval = $interval(function() {
      var tmp = Date.now();
      var offset = tmp - $scope.now;
      $scope.time += (offset);
      $scope.timer_display = ($scope.time/1000).toFixed(3);
      $scope.now = tmp;
    }, $scope.timer_delay);
  };

  $scope.stopTimer = function() {
    $interval.cancel($scope.interval);
  };

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


