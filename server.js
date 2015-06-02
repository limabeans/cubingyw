var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;
var fs = require('fs');

// configuration
app.configure(function() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(multer());
    app.use(express.static('public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({secret:process.env.secret}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

// passport
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// connect to mongoDB
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cubingj';
mongoose.connect(connectionString);

// render static files
app.use(express.static(__dirname + '/public'));

// render home page
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/templates/home.html');
});

// render contest page
app.get('/contest', function(req, res) {
    if (req.user)
        res.sendfile(__dirname + '/templates/contest.html');
    else
        res.sendfile(__dirname + '/templates/login.html');
});

// authorization
app.get('/auth', function(req, res) {
    if (req.user) {
        User.update({_id: req.user._id}, {$set: {active: false}}, function(err, response) {
            if (err)
                return handleError(err);
        });
        req.logout();
        res.redirect('/');
    }
    else
        res.sendfile(__dirname + '/templates/login.html');
});

// define Schemas
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// User Schema
var User = mongoose.model('User', new Schema ({
    id:ObjectId,
    facebook_id:String,
    firstName:String,
    lastName:String,
    email:String,
    wcaID:String,
    provider:String,
    lastPing:{type:Number, default:Date.now()},
    active:{type:Boolean, default:true}
}));

// Solve Schema
var Solve = mongoose.model('Solve' ,new Schema ( {
    id:ObjectId,
    personID:String,
    solveDate: {type: Date, default: Date.now },
    roomID:String,
    solveTime:Number,
    solvePenalty:String,
    solveType:String,
    solveComment:String,
    solveIndex:Number
}));

// Facebook login
passport.use(new FacebookStrategy({
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: '/auth/facebook/callback'
  }, function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
          User.findOne({'email':profile.emails[0].value}, function(err, user) {
              if (err)
                  return done(err);
              if (user)
                  return done(null, user);
              else {
                  var newUser = new User();
                  newUser.facebook_id = profile.id;
                  newUser.firstName = profile.name.givenName;
                  newUser.lastName = profile.name.familyName;
                  newUser.email = profile.emails[0].value;
                  newUser.provider = 'facebook';
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
      });
  }
));

// facebook authentication route
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

// facebook callback route
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/contest', failureRedirect: '/auth' }));

// get authorization status
app.get('/authStatus', function(req, res) {
    if (req.user)
        res.json({status:'connected'});
    else
        res.json({status:'not_authorized'});
});

// send user info such as name, email, and facebook id
app.get('/userInfo', function(req, res) {
    res.send(req.user);
});

var interval = 2000;
setInterval(function() {
    User.find({}, function(err, result) {
        for (var i = 0; i < result.length; i++) {
            if (Date.now() - 3000 > result[i].lastPing) {
                User.update({_id: result[i]._id},
                  {$set: {active: false}},
                  function (err, response) {
                      if (err)
                          throw err;
                  });
            }
            else {
                User.update({_id: result[i]._id},
                  {$set: {active: true}},
                  function (err, response) {
                      if (err)
                          throw err;
                  });
            }
        }
    });
}, interval);

// update user time stamp
app.post('/userTimeStamp', function(req,res) {
    if (req.user) {
        User.update({_id: req.user._id}, {$set: {lastPing: Date.now()}}, function(err, response) {
            if (err)
                return handleError(err);
        });
    }
    User.find({active:true}, function(err, result) {
        res.json(result);
    });
});

// send a list of users
app.get('/userList', function(req,res) {
    User.find({active:true}, function(err,result) {
        res.json(result);
    });
});


// POST for new solve result
// app.post('/newSolve', function(req,res) {
//   var solve = new Solve();
//   solve.solveTime = req.body.solveTime;
//   solve.solveType = req.body.solveType;

//   solve.save(function(err) {
//     if (err) throw err;
//   });


// });

// listen on port and ip
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, ip);
