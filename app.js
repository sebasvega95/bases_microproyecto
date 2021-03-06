var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var resourceful = require('resourceful');
//var passport = require('passport');
var flash = require('connect-flash');
//var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

//Passport
//var User = require('./models/user');

//Set ID for user in DB
/*passport.serializeUser(function(user, done) {
  done(null, user._id);
});*/

//Log out user
/*passport.deserializeUser(function(id, done) {
  User.find({_id : id},function (err, user) {
    if (err || user.length == 0)
      done(err, null);
    else
      done(err, user[0]);
  });
});*/

//User-password strategy
/*passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      User.find( {username : username}, function(err, user) {
        if (err) { return done(err); }
        if (!user || user.length == 0) { return done(null, false, { message: 'Unknown user ' + username }); }
        user = user[0];
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'asdfghjkl' })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', routes);
//app.use('/users', users);

// app.post('/login',
//   passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }),
//   function(req, res) {
//     res.redirect('/');
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* ------------ Setting up the database ------------ */
resourceful.use('couchdb', {
  host : 'localhost',
  port : '5984',
  database : 'bases_microproyecto'
});

// Plantas
var Floor = require("./models/floor")
fs.readFile("./models/definedFloors", function done(err, contents) {
  if (err) {
    console.log("Floors not defined");
    Floor.create({ id: 'P1',
                   type: "URGENCIAS",
                   nBeds: 20,
                   idNurse: "nurse/103"
                });
    Floor.create({ id: 'P2',
                   type: "OBSERVACION",
                   nBeds: 25,
                   idNurse: "nurse/119"
                });
    Floor.create({ id: 'P3',
                   type: "CONSULTORIOS",
                   nBeds: 0,
                   idNurse: "nurse/111"
                });
    Floor.create({ id: 'P4',
                   type: "LABORATORIO Y EXAMENES",
                   nBeds: 0,
                   idNurse: "nurse/108"
                });
    Floor.create({ id: 'P5',
                   type: "CIRUGIA",
                   nBeds: 10,
                   idNurse: "nurse/117"
                });
    Floor.create({ id: 'P6',
                   type: "TRAUMATOLOGIA Y TERAPIAS",
                   nBeds: 15,
                   idNurse: "nurse/119"
                });
    Floor.create({ id: 'P7',
                   type: "UCI",
                   nBeds: 35,
                   idNurse: "nurse/101"
                });

    fs.writeFile("./models/definedFloors", ":D", function (err) {
      if (err)
        return console.log('Error : ', err);
    });
  }
  else
    console.log("Floors defined");

  return;
});

// Áreas
var Sector = require("./models/sector")
fs.readFile("./models/definedSectors", function done(err, contents) {
  if (err) {
    console.log("Sectors not defined");
    Sector.create({ id: 'A1',
                   name: "CARDIOLOGIA",
                   idMedic: "medic/7"
                });
    Sector.create({ id: 'A2',
                   name: "PEDIATRIA",
                   idMedic: "medic/9"
                });
    Sector.create({ id: 'A3',
                   name: "OBSTETRICIA Y GINECOLOGIA",
                   idMedic: "medic/14"
                });
    Sector.create({ id: 'A4',
                   name: "UROLOGIA",
                   idMedic: "medic/8"
                });
    Sector.create({ id: 'A5',
                   name: "ORTOPEDIA",
                   idMedic: "medic/15"
                });
    Sector.create({ id: 'A6',
                   name: "GERIATRIA",
                   idMedic: "medic/12"
                });
    Sector.create({ id: 'A7',
                   name: "NEUROLOGIA",
                   idMedic: "medic/6"
                });

    fs.writeFile("./models/definedSectors", ":D", function (err) {
      if (err)
        return console.log('Error : ', err);
    });
  }
  else
    console.log("Sector defined");

  return;
});


module.exports = app;
